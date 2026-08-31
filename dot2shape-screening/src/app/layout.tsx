import "./globals.css";
import type { Metadata } from "next";
import AuthHeader from "@/components/AuthHeader";

export const metadata: Metadata = {
  title: "Recruite_AI | AI Recruitment Screening",
  description: "AI-powered CV and job description screening for HR teams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <AuthHeader />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </body>
    </html>
  );
}
