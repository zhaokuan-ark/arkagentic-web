"use client";

import Link from "next/link";
import { useAuthSession } from "@/components/auth-session-provider";
import { invoiceExtractorUrl } from "@/lib/app-links";

export default function InvoiceExtractorAppPage() {
  const { isConfigured, isLoading, user } = useAuthSession();

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-200/80">Invoice Extractor</p>
        <h1 className="mt-4 font-heading text-4xl font-bold text-white">Launch workflow</h1>
        <p className="mt-4 max-w-3xl text-slate-300">
          This page is now wired to the ArkAgentic account state. The remaining step is backend entitlement and identity handoff into the product service.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6">
            <h2 className="text-xl font-semibold text-white">Current auth state</h2>
            <div className="mt-4 space-y-2 text-slate-300">
              <p>Supabase configured: {isConfigured ? "Yes" : "No"}</p>
              <p>Session loading: {isLoading ? "Yes" : "No"}</p>
              <p>Signed-in user: {user?.email ?? "Not signed in"}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6">
            <h2 className="text-xl font-semibold text-white">Launch action</h2>
            <p className="mt-4 text-slate-300">
              Until entitlement and token handoff are wired, this button opens the current running product URL.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {user ? (
                <a
                  href={invoiceExtractorUrl}
                  className="inline-flex rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-200"
                >
                  Open current app
                </a>
              ) : (
                <Link
                  href="/signin?next=/apps/invoice-extractor"
                  className="inline-flex rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-200"
                >
                  Sign in first
                </Link>
              )}
              {!user ? (
                <Link
                  href="/signup?next=/apps/invoice-extractor"
                  className="inline-flex rounded-xl border border-white/15 px-5 py-3 font-medium text-white transition hover:bg-white/5"
                >
                  Create account
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
