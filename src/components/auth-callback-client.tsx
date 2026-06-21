"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { getSafeNextPath } from "@/lib/safe-next-path";

type CallbackState = "loading" | "success" | "error";

export function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [state, setState] = useState<CallbackState>("loading");
  const [message, setMessage] = useState("Finishing secure sign-in...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function resolveAuth() {
      const next = getSafeNextPath(searchParams.get("next"));

      if (!supabase) {
        setState("error");
        setError("Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY first.");
        return;
      }

      const hash = window.location.hash;
      const hasHashToken = hash.includes("access_token") || hash.includes("refresh_token");
      const hasCode = searchParams.has("code");
      const hasTokenHash = searchParams.has("token_hash");

      if (hasHashToken && !hasCode && !hasTokenHash) {
        // Implicit flow — Supabase client auto-processes the hash token on init.
        // Parse the type from the hash fragment directly.
        const hashParams = new URLSearchParams(hash.slice(1));
        const type = hashParams.get("type") ?? searchParams.get("type");

        if (type === "signup" || type === "email_confirmation") {
          // Email confirmation: sign out so the user logs in explicitly.
          await supabase.auth.signOut();
          setState("success");
          setMessage("Your email has been confirmed. Please sign in to continue.");
          setTimeout(() => {
            router.replace(`/signin?message=${encodeURIComponent("Your email has been confirmed. Please sign in.")}&next=${encodeURIComponent(next)}`);
          }, 1500);
          return;
        }

        // Magic link or other implicit session — already live.
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          setState("success");
          setMessage("Sign-in complete. Redirecting to your ArkAgentic workspace...");
          setTimeout(() => router.replace(next), 800);
          return;
        }
      } else if (hasCode || hasTokenHash) {
        // PKCE or OTP flow — exchange the code for a session.
        const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (sessionError) {
          setState("error");
          setError(sessionError.message);
          return;
        }

        // Email confirmation via PKCE: sign out so the user logs in explicitly.
        const type = searchParams.get("type");
        if (type === "signup" || type === "email_confirmation") {
          await supabase.auth.signOut();
          setState("success");
          setMessage("Your email has been confirmed. Please sign in to continue.");
          setTimeout(() => {
            router.replace(`/signin?message=${encodeURIComponent("Your email has been confirmed. Please sign in.")}&next=${encodeURIComponent(next)}`);
          }, 1500);
          return;
        }

        // Magic link or other — session is live, go to next.
        if (data.session) {
          setState("success");
          setMessage("Sign-in complete. Redirecting to your ArkAgentic workspace...");
          setTimeout(() => router.replace(next), 800);
          return;
        }
      }

      // No token in URL — check if session already exists
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        setState("error");
        setError(sessionError.message);
        return;
      }

      if (data.session) {
        setState("success");
        setMessage("Sign-in complete. Redirecting to your ArkAgentic workspace...");
        setTimeout(() => router.replace(next), 800);
        return;
      }

      setState("error");
      setError("No active auth session was found. The confirmation link may have expired — please sign in or request a new one.");
    }

    resolveAuth();
  }, [router, searchParams, supabase]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col px-6 py-24">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
        <p className="text-sm uppercase tracking-[0.35em] text-blue-200/80">Auth callback</p>
        <h1 className="mt-4 font-heading text-4xl font-bold text-white">
          {state === "error" ? "Something went wrong" : "Finishing your sign-in"}
        </h1>
        <p className={`mt-4 ${state === "error" ? "text-red-300" : "text-slate-300"}`}>
          {state === "error" ? error : message}
        </p>
        {state === "loading" ? (
          <div className="mt-6 flex items-center gap-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
            <span className="text-sm text-slate-400">Please wait...</span>
          </div>
        ) : null}
        {state === "error" ? (
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
