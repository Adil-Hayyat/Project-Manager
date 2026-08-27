import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

// POST /api/webhook/n8n-callback
// Called BY the n8n workflow once it has run the CV+JD through the AI agent.
// Body shape matches AIScreeningResult (see src/lib/types.ts) plus candidate_id.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { secret, candidate_id, status, error_message, result } = body;

    if (secret !== process.env.N8N_CALLBACK_SECRET) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    if (!candidate_id) {
      return NextResponse.json({ error: "candidate_id is required." }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    if (status === "failed") {
      await supabase
        .from("candidates")
        .update({
          status: "failed",
          error_message: error_message || "Automation workflow reported a failure.",
        })
        .eq("id", candidate_id);
      return NextResponse.json({ ok: true });
    }

    if (!result) {
      return NextResponse.json({ error: "result is required when status is not 'failed'." }, { status: 400 });
    }

    const { error } = await supabase
      .from("candidates")
      .update({
        status: "completed",
        match_score: result.match_score,
        recommendation: result.recommendation,
        reason: result.reason,
        relevant_experience: formatSection(result.relevant_experience),
        technical_skills_match: formatSection(result.technical_skills_match),
        education_match: formatSection(result.education_match),
        missing_skills: (result.missing_or_required_skills || []).join(", "),
        strengths: (result.strengths || []).join(", "),
        concerns: (result.concerns_or_gaps || []).join(", "),
        raw_ai_response: result,
      })
      .eq("id", candidate_id);

    if (error) {
      console.error("Supabase update error (n8n callback):", error);
      return NextResponse.json({ error: "Failed to save result." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("n8n callback error:", err);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}

function formatSection(s?: { facts: string; interpretation: string }) {
  if (!s) return "Not provided.";
  return `Facts: ${s.facts}\nInterpretation: ${s.interpretation}`;
}
