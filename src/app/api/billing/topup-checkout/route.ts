// POST /api/billing/topup-checkout
// Creates a Stripe Checkout session for a one-time AI quota top-up ($20 AUD → +1,000 credits).

import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_TOPUP_PRICE_ID, APP_URL } from "@/lib/stripe";
import { getUserFromRequest, getStripeCustomerIdByUserId, saveStripeCustomerId, getSubscriptionByUserId } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    if (!STRIPE_TOPUP_PRICE_ID) {
      return NextResponse.json({ error: "Top-up not configured" }, { status: 503 });
    }

    // Must have an active/trialing subscription to top up
    const sub = await getSubscriptionByUserId(user.id);
    if (!sub || !["active", "trialing"].includes(sub.status ?? "")) {
      return NextResponse.json({ error: "Active subscription required to purchase a top-up" }, { status: 403 });
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

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: STRIPE_TOPUP_PRICE_ID, quantity: 1 }],
      success_url: `${APP_URL}/billing?topup=success`,
      cancel_url: `${APP_URL}/billing?topup=canceled`,
      metadata: {
        supabase_user_id: user.id,
        product_type: "ai_quota_topup",
        quota_amount: "1000",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[billing/topup-checkout] error:", err);
    return NextResponse.json({ error: "Failed to create top-up checkout session" }, { status: 500 });
  }
}
