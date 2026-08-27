"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const POSITIONS = [
  "Backend Developer",
  "Frontend Developer",
  "Full-Stack Developer",
  "AI/ML Engineer",
  "DevOps Engineer",
  "QA Engineer",
  "Product Manager",
  "UI/UX Designer",
  "Other",
];

export default function NewCandidatePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState(POSITIONS[0]);
  const [cvText, setCvText] = useState("");
  const [jdText, setJdText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileToText(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: string) => void
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.toLowerCase().split(".").pop();
    if (extension !== "txt" && extension !== "pdf") {
      setError("Please choose a .txt or .pdf file.");
      return;
    }

    try {
      if (extension === "txt") {
        setter(await file.text());
        return;
      }

      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";

      const buffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: buffer }).promise;
      const pages: string[] = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        pages.push(
          content.items
            .map((item) => ("str" in item ? item.str : ""))
            .join(" ")
        );
      }

      const text = pages.join("\n\n").trim();
      if (!text) {
        throw new Error("This PDF does not contain selectable text.");
      }
      setter(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read this file.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name || !email || !position || !cvText.trim() || !jdText.trim()) {
      setError("Please fill in all fields before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          position,
          cv_text: cvText,
          jd_text: jdText,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit candidate.");
      }

      router.push(`/candidates/${data.candidate.id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Screen a New Candidate</h1>
      <p className="mb-6 text-sm text-slate-600">
        Enter candidate details, paste the CV and Job Description, and submit.
        The AI screening agent will run automatically and you&apos;ll see the
        result on the next page.
      </p>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Candidate Name</label>
            <input
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ayesha Khan"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="candidate@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Position</label>
          <select
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          >
            {POSITIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="block text-sm font-medium">Candidate CV</label>
            <input
              type="file"
              accept=".txt,.pdf"
              onChange={(e) => handleFileToText(e, setCvText)}
              className="text-xs"
            />
          </div>
          <textarea
            className="h-40 w-full rounded-md border px-3 py-2 text-sm"
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            placeholder="Paste the candidate's CV text here, or upload a .txt or .pdf file above..."
            required
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="block text-sm font-medium">Job Description</label>
            <input
              type="file"
              accept=".txt,.pdf"
              onChange={(e) => handleFileToText(e, setJdText)}
              className="text-xs"
            />
          </div>
          <textarea
            className="h-40 w-full rounded-md border px-3 py-2 text-sm"
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the job description text here, or upload a .txt or .pdf file above..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit & Start Screening"}
        </button>
      </form>
    </div>
  );
}
