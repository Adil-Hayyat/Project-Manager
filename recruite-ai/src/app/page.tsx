import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  Gauge,
  Layers3,
  Play,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-powered screening",
    description:
      "Score each candidate against the job brief using structured reasoning, not just keyword matching.",
  },
  {
    icon: BarChart3,
    title: "Facts vs interpretation",
    description:
      "Every result separates what is evidenced in the CV from what can reasonably be inferred.",
  },
  {
    icon: Layers3,
    title: "Automated workflow",
    description:
      "Trigger screening from a candidate submission and let the n8n workflow move the process forward automatically.",
  },
  {
    icon: Gauge,
    title: "HR dashboard",
    description:
      "Track results, review recommendations, and keep hiring decisions visible across the team.",
  },
];

const steps = [
  "Submit the candidate and role details.",
  "AI compares the CV with the job description.",
  "Get a score, recommendation, and evidence summary.",
  "Review the result on the hiring dashboard.",
];

export default function HomePage() {
  return (
    <div className="space-y-24 pb-16">
      <section className="pt-10 md:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700">
              <Bot className="h-3.5 w-3.5" />
              AI hiring assistant
            </div>
            <h1 className="max-w-xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Hire faster with smarter CV-to-job screening.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Recruite_AI helps HR teams assess candidate fit in minutes, using AI to compare CVs against job requirements and surface clear, structured recommendations.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Get Started — It&apos;s Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <Play className="mr-2 h-4 w-4" />
                See how it works
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Faster shortlists
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Evidence-based scoring
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Candidate fit
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-900">88%</h2>
                </div>
                <div className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  Strong Match
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                    <span>Experience match</span>
                    <span>96%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-200">
                    <div className="h-2.5 w-[96%] rounded-full bg-indigo-600" />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                    <span>Technical skills</span>
                    <span>82%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-200">
                    <div className="h-2.5 w-[82%] rounded-full bg-indigo-500" />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                    <span>Role alignment</span>
                    <span>87%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-200">
                    <div className="h-2.5 w-[87%] rounded-full bg-indigo-400" />
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                <p className="text-sm font-semibold text-indigo-900">Key finding</p>
                <p className="mt-2 text-sm leading-6 text-indigo-800">
                  Strong backend and systems experience, with minor gaps in product ownership and stakeholder communication for the senior role.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Less manual screening, more confident hiring decisions.
          </h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-slate-900 px-6 py-10 text-white shadow-sm md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-300">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
            A simple workflow built for recruiting teams.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step} className="rounded-2xl border border-slate-700 bg-slate-800/80 p-5">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-white">
                {index + 1}
              </div>
              <p className="text-base leading-7 text-slate-200">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 pt-8 text-sm text-slate-500">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-semibold text-slate-900">
            Recruite_AI
          </div>
          <div>© {new Date().getFullYear()} Recruite_AI</div>
        </div>
      </footer>
    </div>
  );
}
