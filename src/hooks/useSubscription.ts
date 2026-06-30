"use client";
// hooks/useSubscription.ts
// Fetches current user's subscription status from the billing API.

import { useState, useEffect, useCallback } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export type SubscriptionStatus = "trialing" | "active" | "past_due" | "canceled" | "unpaid" | null;

export interface SubscriptionState {
  loading: boolean;
  status: SubscriptionStatus;
  hasAccess: boolean;
  trialDaysLeft: number | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  aiQuotaRemaining: number | null;
  aiQuotaMonthly: number | null;
  error: string | null;
}

export function useSubscription(): SubscriptionState & { refresh: () => void } {
  const [state, setState] = useState<SubscriptionState>({
    loading: true,
    status: null,
    hasAccess: false,
    trialDaysLeft: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    aiQuotaRemaining: null,
    aiQuotaMonthly: null,
    error: null,
  });

  const fetchStatus = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        setState({ loading: false, status: null, hasAccess: false, trialDaysLeft: null, currentPeriodEnd: null, cancelAtPeriodEnd: false, aiQuotaRemaining: null, aiQuotaMonthly: null, error: null });
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setState({ loading: false, status: null, hasAccess: false, trialDaysLeft: null, currentPeriodEnd: null, cancelAtPeriodEnd: false, aiQuotaRemaining: null, aiQuotaMonthly: null, error: null });
        return;
      }
      const res = await fetch("/api/billing/status", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch subscription status");
      const data = await res.json();
      setState({
        loading: false,
        status: data.status,
        hasAccess: data.hasAccess ?? false,
        trialDaysLeft: data.trialDaysLeft ?? null,
        currentPeriodEnd: data.currentPeriodEnd ?? null,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd ?? false,
        aiQuotaRemaining: data.aiQuotaRemaining ?? null,
        aiQuotaMonthly: data.aiQuotaMonthly ?? null,
        error: null,
      });
    } catch (err) {
      setState((s) => ({ ...s, loading: false, error: (err as Error).message }));
    }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  return { ...state, refresh: fetchStatus };
}

// Helper: start a checkout session and redirect to Stripe
export async function startCheckout(accessToken: string, options?: { noTrial?: boolean }): Promise<void> {
  const res = await fetch("/api/billing/create-checkout", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ noTrial: options?.noTrial ?? false }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to start checkout");
  if (data.url) window.location.href = data.url;
}

// Helper: open Stripe Customer Portal
export async function openBillingPortal(accessToken: string): Promise<void> {
  const res = await fetch("/api/billing/portal", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to open billing portal");
  if (data.url) window.location.href = data.url;
}

// Helper: start AI quota top-up checkout — opens in new tab so page stays active
export async function startTopupCheckout(accessToken: string): Promise<void> {
  const res = await fetch("/api/billing/topup-checkout", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to start top-up checkout");
  if (data.url) window.open(data.url, "_blank");
}
