"use client";

import { useState } from "react";
import { useAuthSession } from "@/components/auth-session-provider";
import { invoiceExtractorUrl } from "@/lib/app-links";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useSubscription, startCheckout, openBillingPortal } from "@/hooks/useSubscription";

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

function SubscriptionBadge({ status, trialDaysLeft }: { status: string | null; trialDaysLeft: number | null }) {
  if (status === "active") {
    return (
      <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
        Active
      </span>
    );
  }
  if (status === "trialing") {
    return (
      <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200">
        {trialDaysLeft !== null && trialDaysLeft > 0
          ? `Trial — ${trialDaysLeft} day${trialDaysLeft === 1 ? "" : "s"} left`
          : "Trial"}
      </span>
    );
  }
  if (status === "past_due") {
    return (
      <span className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-200">
        Payment failed
      </span>
    );
  }
  return null;
}

// ─── Subscription CTA strip ───────────────────────────────────────────────────

function SubscriptionCta({ status, trialDaysLeft, onStartTrial, onManageBilling, loading }: {
  status: string | null;
  trialDaysLeft: number | null;
  onStartTrial: () => void;
  onManageBilling: () => void;
  loading: boolean;
}) {
  if (loading) return null;

  if (!status || status === "canceled" || status === "unpaid") {
    return (
      <div className="mt-6 rounded-2xl border border-blue-400/20 bg-blue-500/[0.08] px-6 py-5">
        <p className="text-sm font-semibold text-white">Start your 7-day free trial</p>
        <p className="mt-1 text-sm text-slate-400">No charge during the trial. AUD $19/month after.</p>
        <button
          type="button"
          onClick={onStartTrial}
          className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-500"
        >
          Start free trial
        </button>
      </div>
    );
  }

  if (status === "past_due") {
    return (
      <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/[0.08] px-6 py-5">
        <p className="text-sm font-semibold text-red-100">Payment failed — update your payment method to continue</p>
        <button
          type="button"
          onClick={onManageBilling}
          className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-500"
        >
          Update payment method
        </button>
      </div>
    );
  }

  if (status === "trialing" && trialDaysLeft !== null && trialDaysLeft <= 2) {
    return (
      <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-500/[0.08] px-6 py-5">
        <p className="text-sm font-semibold text-amber-100">
          {trialDaysLeft === 0 ? "Your trial ends today" : `Your trial ends in ${trialDaysLeft} day${trialDaysLeft === 1 ? "" : "s"}`}
        </p>
        <p className="mt-1 text-sm text-slate-400">Add a payment method to keep access at AUD $19/month.</p>
        <button
          type="button"
          onClick={onManageBilling}
          className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-500"
        >
          Add payment method
        </button>
      </div>
    );
  }

  return null;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AppsOverview() {
  const { isDemoMode, isLoading, session, user } = useAuthSession();
  const { loading: subLoading, status, hasAccess, trialDaysLeft, refresh: refreshSub } = useSubscription();
  const [launchError, setLaunchError] = useState<string | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

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
    try {
      const token = await getAccessToken();
      await startCheckout(token);
    } catch (err) {
      setLaunchError(err instanceof Error ? err.message : "Failed to start trial. Please try again.");
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
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-200/80">Invoice Extractor</p>
          {user && !isDemoMode && (
            <SubscriptionBadge status={status} trialDaysLeft={trialDaysLeft} />
          )}
        </div>
        <h2 className="mt-3 font-heading text-3xl font-bold text-white">Extract invoices faster</h2>
        <p className="mt-4 max-w-3xl text-slate-300">
          Connect your cloud drive, choose an invoice folder, and turn invoices into structured outputs ready for review and export.
        </p>

        {launchError ? (
          <p className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{launchError}</p>
        ) : null}

        {user && !isDemoMode && !isEmailConfirmed ? (
          <p className="mt-6 rounded-xl border border-amber-300/25 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            Your account is created, but your email is not confirmed yet. Confirm your email before launching apps.
          </p>
        ) : null}

        {/* Subscription CTA — only shown when logged in, not demo mode */}
        {user && !isDemoMode && isEmailConfirmed && (
          <SubscriptionCta
            status={status}
            trialDaysLeft={trialDaysLeft}
            onStartTrial={handleStartTrial}
            onManageBilling={handleManageBilling}
            loading={subLoading || actionLoading}
          />
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {user ? (
            <>
              <button
                type="button"
                onClick={handleLaunch}
                disabled={!canLaunch || isLaunching || isLoading}
                className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {!isEmailConfirmed ? "Confirm email to launch"
                  : !hasAccess && !isDemoMode ? "Subscribe to launch"
                  : isLaunching ? "Launching..."
                  : "Launch app"}
              </button>
              {hasAccess && !isDemoMode && (
                <button
                  type="button"
                  onClick={handleManageBilling}
                  disabled={actionLoading}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-medium text-slate-300 transition hover:bg-white/10"
                >
                  Manage billing
                </button>
              )}
            </>
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

      <div className="rounded-3xl border border-white/8 bg-white/[0.025] p-8 opacity-70 grayscale-[20%]">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400/70">Xero Invoice Upload Tool</p>
        <h2 className="mt-3 font-heading text-3xl font-bold text-slate-200/85">Send invoice data to Xero</h2>
        <p className="mt-4 max-w-3xl text-slate-400/80">
          Prepare reviewed invoice outputs for Xero, map supplier and tax details, and upload approved bills into your accounting workflow.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-xl bg-slate-800/60 px-5 py-3 text-center font-semibold text-slate-400 ring-1 ring-white/5"
          >
            Under Development..
          </button>
        </div>
      </div>
    </div>
  );
}
