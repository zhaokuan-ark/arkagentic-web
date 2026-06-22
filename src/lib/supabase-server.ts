// src/lib/supabase-server.ts
// Server-side Supabase client using service role key
// Only use in API routes / server actions — never in client components

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
if (!supabaseServiceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

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
  const { data, error } = await supabaseAdmin
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
  const { error } = await supabaseAdmin
    .from("subscriptions")
    .upsert(
      { ...sub, updated_at: new Date().toISOString() },
      { onConflict: "stripe_subscription_id" }
    );
  if (error) throw error;
}

export async function getStripeCustomerIdByUserId(userId: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("stripe_customers")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .single();
  return data?.stripe_customer_id ?? null;
}

export async function saveStripeCustomerId(userId: string, stripeCustomerId: string) {
  await supabaseAdmin
    .from("stripe_customers")
    .upsert({ user_id: userId, stripe_customer_id: stripeCustomerId }, { onConflict: "user_id" });
}

// ─── trial fingerprint helpers ────────────────────────────────────────────────

import crypto from "crypto";

export function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip.trim()).digest("hex");
}

export async function checkTrialEligibility(
  userId: string,
  ipAddress: string
): Promise<{ eligible: boolean; reason?: string }> {
  const ipHash = hashIp(ipAddress);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data } = await supabaseAdmin
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
  await supabaseAdmin.from("trial_fingerprints").insert({
    user_id: userId,
    ip_hash: ipHash,
  });
}

// ─── get user from JWT ─────────────────────────────────────────────────────────

export async function getUserFromRequest(request: Request): Promise<{ id: string; email: string } | null> {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "").trim();
  if (!token) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email ?? "" };
}
