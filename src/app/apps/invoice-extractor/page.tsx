"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuthSession } from "@/components/auth-session-provider";
import { invoiceExtractorUrl } from "@/lib/app-links";
import { getSupabaseBrowserClient } from "@/lib/supabase";

function buildInvoiceHandoffUrl() {
  const target = new URL(invoiceExtractorUrl, window.location.origin);
  target.pathname = `${target.pathname.replace(/\/+$/, "")}/api/auth/handoff`;
  target.search = "";
  target.hash = "";
  return target.toString();
}

function submitInvoiceHandoff(accessToken: string) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = buildInvoiceHandoffUrl();
  form.style.display = "none";

  const tokenInput = document.createElement("input");
  tokenInput.type = "hidden";
  tokenInput.name = "accessToken";
  tokenInput.value = accessToken;
  form.appendChild(tokenInput);

  document.body.appendChild(form);
  form.submit();
}

export default function InvoiceExtractorAppPage() {
  const { isLoading, session, user } = useAuthSession();
  const [launchError, setLaunchError] = useState<string | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);

  async function handleLaunch() {
    setLaunchError(null);
    setIsLaunching(true);
    try {
      let accessToken = session?.access_token;
      if (!accessToken) {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = supabase ? await supabase.auth.getSession() : { data: { session: null }, error: null };
        if (error) {
          throw error;
        }
        accessToken = data.session?.access_token;
      }
      if (!accessToken) {
        throw new Error("Your ArkAgentic session is not ready. Please sign in again.");
      }
      submitInvoiceHandoff(accessToken);
    } catch (error) {
      setIsLaunching(false);
      setLaunchError(error instanceof Error ? error.message : "Unable to launch Invoice Extractor.");
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-200/80">Invoice Extractor</p>
        <h1 className="mt-4 font-heading text-4xl font-bold text-white">Extract invoices faster</h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Connect your cloud drive, choose an invoice folder, and turn invoices into structured outputs ready for review and export.
        </p>

        {launchError ? <p className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{launchError}</p> : null}

        <div className="mt-8 flex flex-wrap gap-3">
          {user ? (
            <button
              type="button"
              onClick={handleLaunch}
              disabled={isLaunching || isLoading}
              className="inline-flex rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLaunching ? "Launching..." : "Launch app"}
            </button>
          ) : (
            <Link
              href="/signin?next=/apps/invoice-extractor"
              className="inline-flex rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Sign in to launch
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
  );
}
