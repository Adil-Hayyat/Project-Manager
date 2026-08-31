"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"form" | "success" | "email-confirmation">("form");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.status === 429) {
        setStatus("form");
        setMessage("Too many sign-up attempts. Please wait a moment and try again.");
      } else {
        setStatus("form");
        setMessage("We couldn't create your account right now. Please try again.");
      }
      setLoading(false);
      return;
    }

    // Supabase will return a session when email confirmations are disabled;
    // otherwise, the user is created and must confirm via email.
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setStatus("email-confirmation");
    setMessage("Your account has been created. Check your email to confirm before logging in.");
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Get started</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Create your account</h1>
      </div>

      {message && (
        <div
          className={`mb-4 rounded-md border px-4 py-3 text-sm ${
            status === "email-confirmation"
              ? "border-amber-200 bg-amber-50 text-amber-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {status === "form" && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account? {" "}
        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
          Log in
        </Link>
      </p>
    </div>
  );
}
