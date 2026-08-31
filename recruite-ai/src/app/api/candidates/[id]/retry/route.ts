import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { runScreeningAgent } from "@/lib/screeningAgent";

// POST /api/candidates/[id]/retry
// Runs the screening agent directly from the Next.js server (no n8n involved).
// Used when:
//   - the n8n workflow failed or timed out (status = 'failed')
//   - HR wants to force a re-screen
// This also acts as the "retry / error-handling" bonus feature and as a
// reliable fallback path for the demo if the n8n instance isn't reachable.
export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = getSupabaseServerClient();

  try {
    const { data: candidate, error: fetchError } = await supabase
      .from("candidates")
      .select("*")
      .eq("id", params.id)
      .single();

    if (fetchError || !candidate) {
      return NextResponse.json({ error: "Candidate not found." }, { status: 404 });
    }

    await supabase
      .from("candidates")
      .update({ status: "processing", error_message: null })
      .eq("id", params.id);

    const result = await runScreeningAgent({
      candidateName: candidate.name,
      position: candidate.position,
      cvText: candidate.cv_text,
      jdText: candidate.jd_text,
    });

    const { data: updated, error: updateError } = await supabase
      .from("candidates")
      .update({
        status: "completed",
        match_score: result.match_score,
        recommendation: result.recommendation,
        reason: result.reason,
        relevant_experience: formatSection(result.relevant_experience),
        technical_skills_match: formatSection(result.technical_skills_match),
        education_match: formatSection(result.education_match),
        missing_skills: result.missing_or_required_skills.join(", "),
        strengths: result.strengths.join(", "),
        concerns: result.concerns_or_gaps.join(", "),
        raw_ai_response: result,
        retry_count: (candidate.retry_count || 0) + 1,
      })
      .eq("id", params.id)
      .select()
      .single();

    if (updateError) {
      console.error("Supabase update error:", updateError);
      return NextResponse.json({ error: "Screened but failed to save result." }, { status: 500 });
    }

    return NextResponse.json({ candidate: updated });
  } catch (err: any) {
    console.error("Retry screening error:", err);
    await supabase
      .from("candidates")
      .update({
        status: "failed",
        error_message: err?.message || "Unknown error during AI screening.",
      })
      .eq("id", params.id);

    return NextResponse.json(
      { error: err?.message || "Screening failed." },
      { status: 500 }
    );
  }
}

function formatSection(s: { facts: string; interpretation: string }) {
  return `Facts: ${s.facts}\nInterpretation: ${s.interpretation}`;
}
