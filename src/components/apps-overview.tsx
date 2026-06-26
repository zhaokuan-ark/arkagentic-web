"use client";

import { useState } from "react";
import { useAuthSession } from "@/components/auth-session-provider";
import { invoiceExtractorUrl } from "@/lib/app-links";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useSubscription, startCheckout, openBillingPortal } from "@/hooks/useSubscription";
import { useLanguage } from "@/components/language-provider";

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

// ─── Subscription badge ───────────────────────────────────────────────────────

// ─── Main component ───────────────────────────────────────────────────────────

export function AppsOverview() {
  const { isDemoMode, isLoading, session, user } = useAuthSession();
  const { loading: subLoading, status, hasAccess, trialDaysLeft, refresh: refreshSub } = useSubscription();
  const { t } = useLanguage();
  const a = t.apps;
  const ie = a.invoiceExtractor;
  const [launchError, setLaunchError] = useState<string | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [trialBlocked, setTrialBlocked] = useState(false);

  const isEmailConfirmed = Boolean(user?.email_confirmed_at || user?.confirmed_at);
  const canLaunch = Boolean(user && (isDemoMode || isEmailConfirmed) && (isDemoMode || hasAccess));

  async function getAccessToken(): Promise<string> {
    if (session?.access_token) return session.access_token;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) throw new Error("Auth not available");
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session?.access_token) throw new Error("Your session is not ready. Please sign in again.");
    return data.session.access_token;
  }

  async function handleLaunch() {
    setLaunchError(null);
    if (user && !isDemoMode && !isEmailConfirmed) {
      setLaunchError("Please confirm your email before launching Invoice Extractor. Check your inbox for the confirmation link.");
      return;
    }
    if (user && !isDemoMode && !hasAccess) {
      setLaunchError("An active subscription is required to launch Invoice Extractor.");
      return;
    }
    setIsLaunching(true);
    try {
      const token = await getAccessToken();
      submitInvoiceHandoff(token);
    } catch (error) {
      setIsLaunching(false);
      setLaunchError(error instanceof Error ? error.message : "Unable to launch Invoice Extractor.");
    }
  }

  async function handleStartTrial() {
    setActionLoading(true);
    setLaunchError(null);
    try {
      const token = await getAccessToken();
      await startCheckout(token, { noTrial: trialBlocked });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to start trial. Please try again.";
      if (msg.toLowerCase().includes("location") || msg.toLowerCase().includes("trial has already")) {
        setTrialBlocked(true);
      } else {
        setLaunchError(msg);
      }
      setActionLoading(false);
    }
  }

  async function handleManageBilling() {
    setActionLoading(true);
    try {
      const token = await getAccessToken();
      await openBillingPortal(token);
    } catch (err) {
      setLaunchError(err instanceof Error ? err.message : "Failed to open billing portal. Please try again.");
      setActionLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-200/80">{ie.eyebrow}</p>

        </div>
        <h2 className="mt-3 font-heading text-3xl font-bold text-white">{ie.title}</h2>
        <p className="mt-4 max-w-3xl text-slate-300">{ie.description}</p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          {!user ? (
            // Not logged in
            <a
              href="/signin?next=/apps"
              className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-500"
            >
              {ie.signInToLaunch}
            </a>
          ) : !isEmailConfirmed ? (
            // Email not confirmed
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-xl bg-slate-700 px-6 py-3 font-semibold text-slate-400"
            >
              {ie.confirmEmail}
            </button>
          ) : subLoading ? (
            // Loading subscription state
            <button disabled className="cursor-wait rounded-xl bg-blue-600/50 px-6 py-3 font-semibold text-white/50">
              {ie.loading}
            </button>
          ) : status === null ? (
            // Never subscribed
            trialBlocked ? (
              // IP already used trial — go straight to subscribe
              <button
                type="button"
                onClick={handleStartTrial}
                disabled={actionLoading}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
              >
                {actionLoading ? ie.redirecting : ie.subscribe}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleStartTrial}
                  disabled={actionLoading}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
                >
                  {actionLoading ? ie.starting : ie.startTrial}
                </button>
                <span className="text-sm text-slate-400">{ie.trialHint}</span>
              </>
            )
          ) : status === "canceled" || status === "unpaid" ? (
            // Used trial before
            <>
              <button
                type="button"
                onClick={handleStartTrial}
                disabled={actionLoading}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
              >
                {actionLoading ? ie.redirecting : ie.subscribe}
              </button>
            </>
          ) : status === "past_due" ? (
            // Payment failed
            <>
              <button
                type="button"
                onClick={handleManageBilling}
                disabled={actionLoading}
                className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
              >
                {actionLoading ? ie.opening : ie.updatePayment}
              </button>
              <span className="text-sm text-red-300">{ie.paymentPaused}</span>
            </>
          ) : (
            // Active or trialing
            <>
              <button
                type="button"
                onClick={handleLaunch}
                disabled={isLaunching || isLoading}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
              >
                {isLaunching ? ie.launching : ie.launch}
              </button>

              {status === "trialing" && trialDaysLeft !== null && trialDaysLeft <= 2 && (
                <span className="text-sm text-amber-300">
                  {trialDaysLeft === 0 ? ie.trialEndsToday
                    : trialDaysLeft === 1 ? ie.trialEndsDay
                    : ie.trialEndsDays.replace("{n}", String(trialDaysLeft))}
                </span>
              )}
            </>
          )}
        </div>

        {launchError ? (
          <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{launchError}</p>
        ) : null}
      </div>

      <div className="rounded-3xl border border-white/8 bg-white/[0.025] p-8 opacity-70 grayscale-[20%]">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400/70">{t.apps.xero.eyebrow}</p>
        <h2 className="mt-3 font-heading text-3xl font-bold text-slate-200/85">{t.apps.xero.title}</h2>
        <p className="mt-4 max-w-3xl text-slate-400/80">{t.apps.xero.description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-xl bg-slate-800/60 px-5 py-3 text-center font-semibold text-slate-400 ring-1 ring-white/5"
          >
            {t.apps.xero.underDev}
          </button>
        </div>
      </div>
    </div>
  );
}
