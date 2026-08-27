"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/candidates")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setRows(data.candidates);
      })
      .catch((err) => setError(err.message));
  }, []);

  const recColor: Record<string, string> = {
    "Strong Match": "text-emerald-700",
    "Potential Match": "text-amber-700",
    "Not a Match": "text-red-700",
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Candidates Dashboard</h1>
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase text-slate-500">
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
              <tr key={r.id} className="border-t hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/candidates/${r.id}`} className="font-medium text-indigo-600 hover:underline">
                    {r.name}
                  </Link>
                  <div className="text-xs text-slate-500">{r.email}</div>
                </td>
                <td className="px-4 py-3">{r.position}</td>
                <td className="px-4 py-3 capitalize">{r.status}</td>
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
                  No candidates yet. Submit one from the &quot;New Candidate&quot; page.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
