import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Candidate not found." }, { status: 404 });
    }

    return NextResponse.json({ candidate: data });
  } catch (err) {
    console.error("GET /api/candidates/[id] error:", err);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
