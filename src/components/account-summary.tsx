"use client";

import Link from "next/link";
import { useAuthSession } from "@/components/auth-session-provider";

export function AccountSummary() {
  const { isConfigured, isDemoMode, isLoading, user, session, authNotice } = useAuthSession();

  if (!isConfigured && !isDemoMode) {
    return (
      <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-6 text-amber-100">
        No auth provider is configured yet. Enable demo auth or add Supabase keys to enable account sessions.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6 text-slate-300">
        Loading your account session...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6 text-slate-300">
        <p>You are not signed in yet.</p>
        <div className="mt-4 flex gap-3">
          <Link href="/signin" className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-500">
            Sign in
          </Link>
          <Link href="/signup" className="rounded-xl border border-white/15 px-4 py-2 font-medium text-white transition hover:bg-white/5">
            Create account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Signed-in user</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">{user.email}</h2>
        <p className="mt-3 text-slate-300">Auth ID: {user.id}</p>
        <p className="mt-2 text-slate-400">
          Auth mode: {isDemoMode ? "Local demo auth" : "Supabase auth"}
        </p>
        <p className="mt-2 text-slate-400">Session expires: {session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : isDemoMode ? "Local demo session" : "Unknown"}</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Next platform steps</p>
        <ul className="mt-3 space-y-2 text-slate-300">
          <li>• Create profile row</li>
          <li>• Attach subscription status</li>
          <li>• Connect product access to real user ownership</li>
        </ul>
        {authNotice ? <p className="mt-4 rounded-xl border border-blue-400/20 bg-blue-500/10 p-3 text-sm text-blue-100">{authNotice}</p> : null}
      </div>
    </div>
  );
}
