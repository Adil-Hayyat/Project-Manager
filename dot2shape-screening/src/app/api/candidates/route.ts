import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

// POST /api/candidates
// Creates the candidate record, then fires the n8n webhook to run the
// automated screening workflow (CV+JD -> AI Agent -> Score -> Recommendation).
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, position, cv_text, jd_text } = body;

    if (!name || !email || !position || !cv_text || !jd_text) {
      return NextResponse.json(
        { error: "name, email, position, cv_text and jd_text are all required." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();

    const { data: candidate, error } = await supabase
      .from("candidates")
      .insert({
        name,
        email,
        position,
        cv_text,
        jd_text,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save candidate." }, { status: 500 });
    }

    // Fire the automation workflow. We don't block the HTTP response on n8n's
    // full processing time - the frontend polls GET /api/candidates/[id]
    // for status updates. If triggering fails (e.g. n8n down), we still
    // return success for the save, but flag the candidate so HR can retry.
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await supabase.from("candidates").update({ status: "processing" }).eq("id", candidate.id);

        fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            candidate_id: candidate.id,
            name,
            email,
            position,
            cv_text,
            jd_text,
            callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/n8n-callback`,
            callback_secret: process.env.N8N_CALLBACK_SECRET,
          }),
        }).catch(async (err) => {
          console.error("n8n webhook trigger failed:", err);
          await supabase
            .from("candidates")
            .update({ status: "failed", error_message: "Could not reach automation workflow (n8n)." })
            .eq("id", candidate.id);
        });
      } catch (err) {
        console.error("Error triggering n8n:", err);
      }
    } else {
      console.warn("N8N_WEBHOOK_URL not set - candidate saved as 'pending'. Use the Retry button to screen it directly.");
    }

    return NextResponse.json({ candidate }, { status: 201 });
  } catch (err) {
    console.error("POST /api/candidates error:", err);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}

// GET /api/candidates - list all candidates, most recent first (dashboard/bonus feature)
export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("candidates")
      .select(
        "id, name, email, position, status, match_score, recommendation, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase list error:", error);
      return NextResponse.json({ error: "Failed to fetch candidates." }, { status: 500 });
    }

    return NextResponse.json({ candidates: data });
  } catch (err) {
    console.error("GET /api/candidates error:", err);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
