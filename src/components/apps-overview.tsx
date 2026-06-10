"use client";

import Link from "next/link";
import { useAuthSession } from "@/components/auth-session-provider";

export function AppsOverview() {
  const { isConfigured, isDemoMode, isLoading, user } = useAuthSession();

  const launchHref = user ? "/apps/invoice-extractor" : "/signin?next=/apps/invoice-extractor";

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-200/80">Invoice Extractor</p>
        <h2 className="mt-3 font-heading text-3xl font-bold text-white">Primary launch app</h2>
        <p className="mt-4 max-w-3xl text-slate-300">
          Extract invoice data from cloud folders with user-based ownership, billing-aware access, and backend authorization.
        </p>
        <div className="mt-6 text-sm text-slate-400">
          {isLoading
            ? "Loading account state..."
            : user
              ? `Signed in as ${user.email}${isDemoMode ? " (demo auth)" : ""}`
              : isConfigured || isDemoMode
                ? "Sign in to continue into account-aware product access."
                : "Configure Supabase or enable demo auth to unlock app launching."}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={launchHref}
            className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-500"
          >
            {user ? "Open app" : "Sign in to open app"}
          </Link>
          {!user ? (
            <Link
              href="/signup?next=/apps/invoice-extractor"
              className="rounded-xl border border-white/15 px-5 py-3 text-center font-medium text-white transition hover:bg-white/5"
            >
              Create account
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
