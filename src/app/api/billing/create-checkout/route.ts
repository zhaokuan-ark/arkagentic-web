// POST /api/billing/create-checkout
// Creates a Stripe Checkout session for the Invoice Extractor subscription.
// Includes a 7-day free trial (no charge during trial).

import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_PRICE_ID, APP_URL } from "@/lib/stripe";
import {
  getUserFromRequest,
  getStripeCustomerIdByUserId,
  saveStripeCustomerId,
  checkTrialEligibility,
  recordTrialFingerprint,
  getSubscriptionByUserId,
} from "@/lib/supabase-server";

function getClientIp(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const ips = xff.split(",").map((s) => s.trim());
    // Skip private/loopback addresses to get real IP
    const publicIp = ips.find((ip) => !ip.startsWith("127.") && !ip.startsWith("10.") && !ip.startsWith("192.168.") && ip !== "::1");
    if (publicIp) return publicIp;
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    if (!STRIPE_PRICE_ID) {
      return NextResponse.json({ error: "Billing is not configured" }, { status: 503 });
    }

    // Check if user already has an active/trialing subscription
    const existingSub = await getSubscriptionByUserId(user.id);
    if (existingSub && ["trialing", "active"].includes(existingSub.status ?? "")) {
      return NextResponse.json({
        error: "You already have an active subscription",
        status: existingSub.status,
      }, { status: 409 });
    }

    // Parse body — noTrial=true skips the fingerprint check and creates a direct subscription
    let noTrial = false;
    try {
      const body = await request.json();
      noTrial = body?.noTrial === true;
    } catch { /* body may be empty */ }

    // Check trial eligibility (IP fingerprint) — skip when noTrial
    const clientIp = getClientIp(request);
    if (!noTrial) {
      const eligibility = await checkTrialEligibility(user.id, clientIp);
      if (!eligibility.eligible) {
        return NextResponse.json({
          error: "A free trial has already been used from this location. Please subscribe directly.",
          code: eligibility.reason,
          noTrial: true,
        }, { status: 403 });
      }
    }

    // Get or create Stripe customer
    let stripeCustomerId = await getStripeCustomerIdByUserId(user.id);
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      stripeCustomerId = customer.id;
      await saveStripeCustomerId(user.id, stripeCustomerId);
    }

    // Create Stripe Checkout session — with or without trial
    const subscriptionData = noTrial
      ? { metadata: { supabase_user_id: user.id } }
      : { trial_period_days: 7, metadata: { supabase_user_id: user.id } };

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
      subscription_data: subscriptionData,
      success_url: `${APP_URL}/apps?subscription=${noTrial ? "success" : "trial"}`,
      cancel_url: `${APP_URL}/pricing?subscription=canceled`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      customer_update: { address: "auto" },
      metadata: { supabase_user_id: user.id },
    });

    // Record fingerprint only for trial checkouts
    if (!noTrial) await recordTrialFingerprint(user.id, clientIp);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[billing/create-checkout] error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
