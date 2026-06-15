"use client";

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

export function AppsOverview() {
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
        throw new Error("Your session is not ready. Please sign in again.");
      }
      submitInvoiceHandoff(accessToken);
    } catch (error) {
      setIsLaunching(false);
      setLaunchError(error instanceof Error ? error.message : "Unable to launch Invoice Extractor.");
    }
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-200/80">Invoice Extractor</p>
        <h2 className="mt-3 font-heading text-3xl font-bold text-white">Extract invoices faster</h2>
        <p className="mt-4 max-w-3xl text-slate-300">
          Connect your cloud drive, choose an invoice folder, and turn invoices into structured outputs ready for review and export.
        </p>

        {launchError ? <p className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{launchError}</p> : null}

        <div className="mt-6 flex flex-wrap gap-3">
          {user ? (
            <button
              type="button"
              onClick={handleLaunch}
              disabled={isLaunching || isLoading}
              className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLaunching ? "Launching..." : "Launch app"}
            </button>
          ) : (
            <a
              href="/signin?next=/apps"
              className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-500"
            >
              Sign in to launch
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
