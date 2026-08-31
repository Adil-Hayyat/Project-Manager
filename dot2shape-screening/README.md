# Recruite_AI — AI Recruitment Screening Automation

An AI-powered system that automatically screens candidate CVs against a Job
Description (JD), scores the match, and gives HR a structured, evidence-based
recommendation — replacing manual first-pass CV review.

---

## 1. Project Overview

**Flow:** HR submits a candidate (name, email, position, CV, JD) →
the app saves it to Supabase and triggers an **n8n automation workflow** →
n8n sends the CV+JD to an **OpenAI-powered screening agent** using a
structured prompt → the agent returns a JSON assessment (score, strengths,
gaps, recommendation) → n8n calls back into the app, which saves the result
and (bonus) emails HR → HR sees the result live in the web UI.

Core features implemented:
- Candidate submission form (name, email, position, CV, JD — paste or `.txt` upload)
- AI screening agent with structured JSON output (score, experience/skills/education
  match, missing skills, strengths, concerns, recommendation + reason)
- n8n automation workflow (CV+JD → AI Agent → Score → Recommendation → callback)
- Results page that polls for status and renders the assessment
- Dashboard listing all screened candidates (bonus)
- Retry / error-handling for failed screenings (bonus)
- HR email notification node in the n8n workflow (bonus)

---

## 2. Architecture

```
┌─────────────┐      POST /api/candidates       ┌──────────────────┐
│  Next.js UI │ ───────────────────────────────▶ │  Next.js API      │
│ (form, results,                                 │  routes (server)  │
│  dashboard)  │◀────── polls GET /api/candidates/[id] ─┤            │
└─────────────┘                                  └─────────┬──────────┘
                                                             │ insert row (status=pending)
                                                             ▼
                                                     ┌───────────────┐
                                                     │  Supabase DB   │
                                                     │  (candidates)  │
                                                     └───────┬────────┘
                                                             │ trigger webhook
                                                             ▼
                                                   ┌───────────────────┐
                                                   │  n8n workflow      │
                                                   │  Webhook → OpenAI  │
                                                   │  → Parse/Validate  │
                                                   │  → Callback → Email│
                                                   └─────────┬──────────┘
                                                             │ POST /api/webhook/n8n-callback
                                                             ▼
                                                     back to Supabase (status=completed)
```

**Why this shape:**
- The Next.js API is the *only* thing that touches Supabase directly (using
  the service role key, server-side only) — the browser never gets DB
  credentials.
- n8n owns the *automation workflow* requirement end-to-end: it receives the
  CV+JD, calls the AI agent, and reports back — this is a real automation
  tool orchestrating the process, not just a UI feature.
- A **direct retry path** (`/api/candidates/[id]/retry`) reuses the exact
  same prompt and calls OpenAI directly from the Next.js server. This exists
  for error-handling/retries and as a reliability fallback for the live demo
  in case the n8n webhook is unreachable — the UI's "Retry" button uses it.

---

## 3. Technologies Used

| Layer          | Choice                          | Why |
|----------------|----------------------------------|-----|
| Frontend + API | Next.js 14 (App Router)          | Frontend and backend in one project — fastest to build and deploy for a 24hr MVP; API routes double as the automation's webhook receiver. |
| Database       | Supabase (Postgres)              | Managed Postgres with instant REST access, RLS, and a generous free tier — no infra setup needed. |
| AI              | OpenAI API (`gpt-4o-mini`)      | Reliable structured JSON output via `response_format: json_object`, low cost/latency, good instruction-following for a screening task. |
| Automation     | n8n (self-hosted or n8n.cloud)   | Visual, webhook-based workflow tool explicitly suggested in the brief; lets HR/ops later edit the workflow (e.g. add Slack, ATS) without touching code. |
| Styling        | Tailwind CSS                     | Fast to build a usable (not fancy) UI within the time budget. |

---

## 4. Setup Instructions

### 4.1 Supabase
1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL Editor and run `supabase/schema.sql` from this repo.
3. Copy your Project URL, `anon` key, and `service_role` key (Settings → API).

### 4.2 OpenAI
1. Get an API key from [platform.openai.com](https://platform.openai.com).
2. (Optional) Change `OPENAI_MODEL` in `.env` if you want a different model.

### 4.3 App
```bash
git clone <your-repo-url>
cd recruite-ai
npm install
cp .env.example .env.local
# fill in .env.local with your Supabase + OpenAI + n8n values (see section 5)
npm run dev
```
App runs at `http://localhost:3000`.

### 4.4 n8n
1. Run n8n locally (`npx n8n`) or use n8n.cloud.
2. Import `n8n/recruitment-screening-workflow.json` (Workflows → Import from File).
3. Add your OpenAI credential and (optionally) SMTP credential in n8n, and
   attach them to the **OpenAI - Screen Candidate** and **Email HR** nodes.
4. Activate the workflow and copy its **Production Webhook URL**.
5. Paste that URL into `.env.local` as `N8N_WEBHOOK_URL`.
6. Make sure `NEXT_PUBLIC_APP_URL` in `.env.local` is reachable from n8n
   (use a tunnel like `ngrok http 3000` if running both locally).

If `N8N_WEBHOOK_URL` is left empty, candidates are still saved — HR can
click **Retry Screening** on the result page to run the AI agent directly
(no automation, but fully functional for testing).

---

## 5. API Configuration (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4o-mini

N8N_WEBHOOK_URL=...
N8N_CALLBACK_SECRET=some-random-string   # must match what n8n sends back
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 6. AI Model Used

**OpenAI `gpt-4o-mini`**, called with:
- `temperature: 0.2` — screening should be consistent, not creative.
- `response_format: { type: "json_object" }` — forces valid JSON output,
  removing the need for fragile text-parsing.

Chosen over a larger model because CV screening is a well-structured
extraction + comparison task rather than open-ended reasoning — `gpt-4o-mini`
gives strong instruction-following at a fraction of the cost/latency, which
matters for an HR tool that may screen many candidates.

---

## 7. Prompt Used & Prompt Engineering Rationale

Full prompt: [`src/lib/prompt.ts`](src/lib/prompt.ts) (also embedded in the
n8n workflow's OpenAI node so both automation paths behave identically).

**System prompt (summary of what it enforces):**
1. **No hallucination** — "use ONLY information explicitly stated in the CV
   and JD... if something needed to judge a requirement is missing from the
   CV, treat it as 'not demonstrated' rather than guessing." This directly
   satisfies the requirement that the AI must not assume information that
   isn't present.
2. **Facts vs. interpretation, structurally separated** — every scored
   section (`relevant_experience`, `technical_skills_match`,
   `education_match`) is a JSON object with two distinct fields: `facts`
   (only what's literally written in the CV) and `interpretation` (the
   model's judgment of how that maps to the JD). This isn't just an
   instruction — it's enforced by the *shape* of the output, which is much
   harder for the model to violate than a single free-text paragraph would
   be, and lets HR audit the AI's reasoning instead of taking the verdict on
   faith.
3. **Always relative to the given JD** — the prompt explicitly says "evaluate
   strictly against the JD given — not against a generic idea of a 'good
   candidate'", so a skill the JD never asked for doesn't move the score.
4. **Consistency** — `temperature: 0.2`, an explicit numeric scoring rubric
   (80–100 / 50–79 / 0–49) tied to the recommendation label, and an
   instruction to "score conservatively when evidence is thin" so the same
   CV+JD pair produces similar results across runs.
5. **Structured, parseable output only** — a strict JSON schema is given
   with every required key; the app additionally **validates** the response
   server-side (`src/lib/screeningAgent.ts`) and derives the recommendation
   from the score if the label is ever missing/invalid, so a malformed AI
   response can't silently corrupt HR-facing data.
6. **Explicit edge case handling** — if the CV text is empty/garbled, the
   prompt instructs the model to score it 0 / "Not a Match" and explain why,
   instead of inventing an assessment.

---

## 8. Automation Workflow

`n8n/recruitment-screening-workflow.json`:

```
Webhook (receives candidate_id, name, position, cv_text, jd_text, callback_url)
   → OpenAI node (system prompt + candidate data → structured JSON)
   → Code node (parse & validate the JSON; branch on success/failure)
   → IF success:
        → HTTP Request: POST result back to /api/webhook/n8n-callback
        → Email HR (bonus): notify HR with name/position/score/recommendation
     IF failure:
        → HTTP Request: POST status="failed" + error_message back to the app
   → Respond to Webhook
```

This is triggered automatically by the app the moment a candidate is
submitted — no manual step in n8n is required. The callback endpoint is
protected by a shared secret (`N8N_CALLBACK_SECRET`) so only this workflow
can write results back.

---

## 9. Key Decisions

- **n8n as the automation layer, not just "AI called from the backend"** —
  satisfies the brief's explicit automation-workflow requirement and keeps
  the AI-calling logic editable by non-developers later (e.g. adding Slack
  or an ATS step is a drag-and-drop change, not a code change).
- **JSON-schema-enforced AI output** over free-text — makes the result safe
  to store, render, and diff across re-screenings, and makes "facts vs.
  interpretation" a structural guarantee rather than a hope.
- **Direct retry endpoint as a fallback** — automation tools can go down;
  the app stays usable (and demoable) even if n8n is unreachable.
- **No DB access from the browser** — all Supabase access goes through
  server-side API routes using the service role key; RLS is enabled with no
  public policies.
- **Scope control** — CV upload accepts `.txt` (paste is the primary path);
  full PDF/DOCX parsing was left out of the core flow to protect the 24-hour
  budget, and is listed as a natural next bonus (CV parsing).

---

## 10. Possible Next Steps (not implemented)
- PDF/DOCX CV parsing on upload
- Human-approval step before a final "Not a Match" rejection email goes out
- Slack notification alongside email
- Agent memory / comparison against previously screened candidates for the same role
- Analytics dashboard (average score by position, funnel over time)

---

## 11. Sample Data
See `/sample-data`:
- `sample-jd.txt` — Backend Developer (Node.js) JD
- `sample-cv-strong-match.txt` — candidate who should score high
- `sample-cv-weak-match.txt` — candidate who should score low, for testing the "Not a Match" path
