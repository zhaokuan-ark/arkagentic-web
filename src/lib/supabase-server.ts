// src/lib/supabase-server.ts
// Server-side Supabase client using service role key
// Only use in API routes / server actions — never in client components

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import crypto from "crypto";

// Lazy singleton — avoids top-level throw that crashes the Lambda module at cold start
let _supabaseAdmin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdmin) return _supabaseAdmin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  _supabaseAdmin = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return _supabaseAdmin;
}

// ─── subscription helpers ─────────────────────────────────────────────────────

export type SubscriptionStatus = "trialing" | "active" | "past_due" | "canceled" | "unpaid" | null;

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  status: SubscriptionStatus;
  plan_id: string;
  trial_ends_at: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

export async function getSubscriptionByUserId(userId: string): Promise<Subscription | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (error || !data) return null;
  return data as Subscription;
}

export async function upsertSubscription(sub: Partial<Subscription> & {
  stripe_subscription_id: string;
  user_id: string;
  stripe_customer_id: string;
  status: SubscriptionStatus;
}) {
  const { error } = await getSupabaseAdmin()
    .from("subscriptions")
    .upsert(
      { ...sub, updated_at: new Date().toISOString() },
      { onConflict: "stripe_subscription_id" }
    );
  if (error) throw error;
}

export async function getStripeCustomerIdByUserId(userId: string): Promise<string | null> {
  const { data } = await getSupabaseAdmin()
    .from("stripe_customers")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .single();
  return data?.stripe_customer_id ?? null;
}

export async function saveStripeCustomerId(userId: string, stripeCustomerId: string) {
  await getSupabaseAdmin()
    .from("stripe_customers")
    .upsert({ user_id: userId, stripe_customer_id: stripeCustomerId }, { onConflict: "user_id" });
}

// ─── trial fingerprint helpers ────────────────────────────────────────────────

export function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip.trim()).digest("hex");
}

export async function checkTrialEligibility(
  userId: string,
  ipAddress: string
): Promise<{ eligible: boolean; reason?: string }> {
  const ipHash = hashIp(ipAddress);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data } = await getSupabaseAdmin()
    .from("trial_fingerprints")
    .select("id, user_id")
    .eq("ip_hash", ipHash)
    .neq("user_id", userId)
    .gte("trial_started_at", thirtyDaysAgo)
    .limit(1);

  if (data && data.length > 0) {
    return { eligible: false, reason: "trial_ip_already_used" };
  }
  return { eligible: true };
}

export async function recordTrialFingerprint(userId: string, ipAddress: string) {
  const ipHash = hashIp(ipAddress);
  await getSupabaseAdmin().from("trial_fingerprints").insert({
    user_id: userId,
    ip_hash: ipHash,
  });
}

// ─── get user from JWT ─────────────────────────────────────────────────────────

export async function getUserFromRequest(request: Request): Promise<{ id: string; email: string } | null> {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "").trim();
  if (!token) return null;
  const { data, error } = await getSupabaseAdmin().auth.getUser(token);
  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email ?? "" };
}

// ─── AI Quota helpers ─────────────────────────────────────────────────────────

export async function getAiQuota(userId: string): Promise<{ remaining: number; monthly: number } | null> {
  const { data } = await getSupabaseAdmin()
    .from("subscriptions")
    .select("ai_quota_remaining, ai_quota_monthly")
    .eq("user_id", userId)
    .in("status", ["active", "trialing"])
    .limit(1)
    .single();
  if (!data) return null;
  return { remaining: data.ai_quota_remaining ?? 0, monthly: data.ai_quota_monthly ?? 200 };
}

export async function resetMonthlyQuota(userId: string): Promise<void> {
  await getSupabaseAdmin().rpc("reset_monthly_ai_quota", { p_user_id: userId });
}

export async function addTopupQuota(userId: string, quota: number, stripePaymentId: string, amountAud: number): Promise<void> {
  const admin = getSupabaseAdmin();
  // Idempotent: skip if this payment was already processed
  const { data: existing } = await admin
    .from("ai_quota_topups")
    .select("id")
    .eq("stripe_payment_id", stripePaymentId)
    .limit(1);
  if (existing && existing.length > 0) return;

  await admin.from("ai_quota_topups").insert({
    user_id: userId,
    stripe_payment_id: stripePaymentId,
    amount_aud: amountAud,
    quota_added: quota,
  });
  await admin.rpc("add_topup_ai_quota", { p_user_id: userId, p_quota: quota });
}

export async function deductAiQuota(userId: string, amount: number): Promise<boolean> {
  const { data } = await getSupabaseAdmin().rpc("deduct_ai_quota", {
    p_user_id: userId,
    p_amount: amount,
  });
  return data === true;
}
