"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface Row {
  id: string;
  name: string;
  email: string;
  position: string;
  status: string;
  match_score: number | null;
  recommendation: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserEmail(user?.email ?? null);

      const response = await fetch("/api/candidates");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to load candidates.");
      }
      setRows(data.candidates);
    }

    loadData().catch((err) => setError(err.message));
  }, []);

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const recColor: Record<string, string> = {
    "Strong Match": "text-emerald-700",
    "Potential Match": "text-amber-700",
    "Not a Match": "text-red-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Candidates</h1>
        </div>

        <div className="flex items-center gap-3">
          {userEmail && (
            <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 sm:inline-flex">
              {userEmail}
            </span>
          )}
          <Link
            href="/screen/new"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Screen New Candidate
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Sign out
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Position</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Recommendation</th>
              <th className="px-4 py-3">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-slate-200 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/candidates/${r.id}`} className="font-medium text-indigo-600 hover:underline">
                    {r.name}
                  </Link>
                  <div className="text-xs text-slate-500">{r.email}</div>
                </td>
                <td className="px-4 py-3">{r.position}</td>
                <td className="px-4 py-3 capitalize text-slate-700">{r.status}</td>
                <td className="px-4 py-3">{r.match_score ?? "-"}</td>
                <td className={`px-4 py-3 font-medium ${recColor[r.recommendation || ""] || ""}`}>
                  {r.recommendation ?? "-"}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {new Date(r.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {rows.length === 0 && !error && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  No candidates yet. Start by screening a new candidate.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
