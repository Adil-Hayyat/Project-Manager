import OpenAI from "openai";
import { SCREENING_SYSTEM_PROMPT, buildUserPrompt } from "./prompt";
import type { AIScreeningResult, Recommendation } from "./types";

const VALID_RECOMMENDATIONS: Recommendation[] = [
  "Strong Match",
  "Potential Match",
  "Not a Match",
];

/**
 * Runs the CV vs JD screening. This is the same logic conceptually
 * mirrored in the n8n workflow's OpenAI node (see /n8n/recruitment-screening-workflow.json)
 * so the two automation paths (in-app direct call, and n8n webhook) produce
 * the same structured result.
 */
export async function runScreeningAgent(params: {
  candidateName: string;
  position: string;
  cvText: string;
  jdText: string;
}): Promise<AIScreeningResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY env var.");
  }

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.2, // low temperature for consistent, repeatable screening output
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SCREENING_SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(params) },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("AI returned an empty response.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("AI response was not valid JSON.");
  }

  return validateScreeningResult(parsed);
}

/** Defensive validation - never trust the model to be 100% schema-perfect. */
function validateScreeningResult(data: unknown): AIScreeningResult {
  if (typeof data !== "object" || data === null) {
    throw new Error("AI response was not a JSON object.");
  }
  const d = data as Record<string, any>;

  const score = Number(d.match_score);
  if (Number.isNaN(score) || score < 0 || score > 100) {
    throw new Error("AI response had an invalid match_score.");
  }

  const recommendation = VALID_RECOMMENDATIONS.includes(d.recommendation)
    ? (d.recommendation as Recommendation)
    : inferRecommendationFromScore(score);

  const section = (s: any) => ({
    facts: typeof s?.facts === "string" ? s.facts : "Not provided.",
    interpretation:
      typeof s?.interpretation === "string" ? s.interpretation : "Not provided.",
  });

  return {
    match_score: Math.round(score),
    recommendation,
    reason: typeof d.reason === "string" ? d.reason : "No reason provided by AI.",
    relevant_experience: section(d.relevant_experience),
    technical_skills_match: section(d.technical_skills_match),
    education_match: section(d.education_match),
    missing_or_required_skills: Array.isArray(d.missing_or_required_skills)
      ? d.missing_or_required_skills.map(String)
      : [],
    strengths: Array.isArray(d.strengths) ? d.strengths.map(String) : [],
    concerns_or_gaps: Array.isArray(d.concerns_or_gaps)
      ? d.concerns_or_gaps.map(String)
      : [],
  };
}

// Fallback safety net in case the model returns a score but an invalid/missing
// recommendation label - keeps score and label consistent per our scoring guide.
function inferRecommendationFromScore(score: number): Recommendation {
  if (score >= 80) return "Strong Match";
  if (score >= 50) return "Potential Match";
  return "Not a Match";
}
