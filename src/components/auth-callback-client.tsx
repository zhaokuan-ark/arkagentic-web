"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [message, setMessage] = useState("Finishing secure sign-in...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function resolveAuth() {
      const next = searchParams.get("next") || "/apps";

      if (!supabase) {
        setError("Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY first.");
        return;
      }

      const hash = window.location.hash;
      const hasToken = hash.includes("access_token") || hash.includes("refresh_token") || searchParams.has("code");

      if (hasToken) {
        const { error: sessionError } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (sessionError) {
          setError(sessionError.message);
          return;
        }
      } else {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          setError(sessionError.message);
          return;
        }
        if (!data.session) {
          setError("No active auth session was found after the email link returned.");
          return;
        }
      }

      setMessage("Sign-in complete. Redirecting to your ArkAgentic workspace...");
      router.replace(next);
    }

    resolveAuth();
  }, [router, searchParams, supabase]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col px-6 py-24">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
        <p className="text-sm uppercase tracking-[0.35em] text-blue-200/80">Auth callback</p>
        <h1 className="mt-4 font-heading text-4xl font-bold text-white">Finishing your ArkAgentic sign-in</h1>
        <p className="mt-4 text-slate-300">{error ?? message}</p>
        {error ? (
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signin" className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500">
              Back to sign in
            </Link>
            <Link href="/signup" className="rounded-xl border border-white/15 px-5 py-3 font-medium text-white transition hover:bg-white/5">
              Create account
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
