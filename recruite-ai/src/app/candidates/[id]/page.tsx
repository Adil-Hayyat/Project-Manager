"use client";

import { useEffect, useRef, useState } from "react";
import type { Candidate } from "@/lib/types";

export default function CandidateResultPage({ params }: { params: { id: string } }) {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function fetchCandidate() {
    try {
      const res = await fetch(`/api/candidates/${params.id}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load candidate.");
      setCandidate(data.candidate);
      if (data.candidate.status === "completed" || data.candidate.status === "failed") {
        if (pollRef.current) clearInterval(pollRef.current);
      }
    } catch (err: any) {
      setLoadError(err.message || "Failed to load candidate.");
      if (pollRef.current) clearInterval(pollRef.current);
    }
  }

  useEffect(() => {
    fetchCandidate();
    pollRef.current = setInterval(fetchCandidate, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function handleRetry() {
    setRetrying(true);
    try {
      const res = await fetch(`/api/candidates/${params.id}/retry`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Retry failed.");
      setCandidate(data.candidate);
    } catch (err: any) {
      setLoadError(err.message || "Retry failed.");
    } finally {
      setRetrying(false);
    }
  }

  if (loadError) {
    return <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">{loadError}</div>;
  }

  if (!candidate) {
    return <div className="text-slate-600">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{candidate.name}</h1>
          <p className="text-sm text-slate-600">
            {candidate.email} &middot; Applying for <strong>{candidate.position}</strong>
          </p>
        </div>
        <StatusBadge status={candidate.status} />
      </div>

      {(candidate.status === "pending" || candidate.status === "processing") && (
        <div className="rounded-md border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-800">
          The AI screening agent is analyzing this candidate against the job
          description. This page updates automatically every few seconds...
        </div>
      )}

      {candidate.status === "failed" && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="mb-2 font-medium">Screening failed.</p>
          <p className="mb-3">{candidate.error_message || "Unknown error."}</p>
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {retrying ? "Retrying..." : "Retry Screening"}
          </button>
        </div>
      )}

      {candidate.status === "completed" && (
        <div className="space-y-6">
          <ScoreCard candidate={candidate} />

          <Section title="Relevant Experience" body={candidate.relevant_experience} />
          <Section title="Technical Skills Match" body={candidate.technical_skills_match} />
          <Section title="Education Match" body={candidate.education_match} />

          <div className="grid gap-4 sm:grid-cols-3">
            <ListCard title="Strengths" items={candidate.strengths} color="emerald" />
            <ListCard title="Concerns / Gaps" items={candidate.concerns} color="amber" />
            <ListCard title="Missing / Required Skills" items={candidate.missing_skills} color="red" />
          </div>

          <div className="pt-2">
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-slate-100 disabled:opacity-50"
            >
              {retrying ? "Re-screening..." : "Re-run Screening"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-slate-100 text-slate-700",
    processing: "bg-indigo-100 text-indigo-700",
    completed: "bg-emerald-100 text-emerald-700",
    failed: "bg-red-100 text-red-700",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status] || ""}`}>
      {status}
    </span>
  );
}

function ScoreCard({ candidate }: { candidate: Candidate }) {
  const rec = candidate.recommendation || "Not a Match";
  const recStyles: Record<string, string> = {
    "Strong Match": "bg-emerald-600",
    "Potential Match": "bg-amber-500",
    "Not a Match": "bg-red-600",
  };
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-indigo-600 text-xl font-bold">
          {candidate.match_score ?? "-"}
        </div>
        <div>
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold text-white ${recStyles[rec]}`}>
            {rec}
          </span>
          <p className="mt-2 max-w-xl text-sm text-slate-700">{candidate.reason}</p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, body }: { title: string; body: string | null }) {
  if (!body) return null;
  const [factsLine, interpretationLine] = splitFactsInterpretation(body);
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
      {factsLine && (
        <p className="mb-1 text-sm text-slate-700">
          <span className="font-medium text-slate-500">Facts: </span>
          {factsLine}
        </p>
      )}
      {interpretationLine && (
        <p className="text-sm text-slate-700">
          <span className="font-medium text-slate-500">Interpretation: </span>
          {interpretationLine}
        </p>
      )}
    </div>
  );
}

function splitFactsInterpretation(body: string): [string, string] {
  const factsMatch = body.match(/Facts:\s*([\s\S]*?)(?:\nInterpretation:|$)/);
  const interpretationMatch = body.match(/Interpretation:\s*([\s\S]*)$/);
  return [factsMatch?.[1]?.trim() || "", interpretationMatch?.[1]?.trim() || ""];
}

function ListCard({
  title,
  items,
  color,
}: {
  title: string;
  items: string | null;
  color: "emerald" | "amber" | "red";
}) {
  const list = (items || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const dot: Record<string, string> = {
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
      {list.length === 0 ? (
        <p className="text-xs text-slate-400">None noted.</p>
      ) : (
        <ul className="space-y-1">
          {list.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
              <span className={`mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full ${dot[color]}`} />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
