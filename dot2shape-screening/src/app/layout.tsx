import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dot2Shape Recruitment Screening",
  description: "AI-powered CV vs JD screening tool for HR",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
            <Link href="/" className="font-semibold text-lg">
              Dot2Shape <span className="text-indigo-600">Screening</span>
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/" className="hover:text-indigo-600">
                New Candidate
              </Link>
              <Link href="/candidates" className="hover:text-indigo-600">
                Dashboard
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
