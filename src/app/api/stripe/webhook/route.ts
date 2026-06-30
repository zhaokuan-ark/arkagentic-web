// POST /api/stripe/webhook
// Handles Stripe webhook events and syncs subscription state to Supabase.

import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import { upsertSubscription, addTopupQuota, resetMonthlyQuota } from "@/lib/supabase-server";
import type Stripe from "stripe";

// Stripe v22 moved current_period_start/end to subscription items
function getPeriod(sub: Stripe.Subscription): { start: string | null; end: string | null } {
  const item = sub.items?.data?.[0];
  return {
    start: item?.current_period_start ? new Date(item.current_period_start * 1000).toISOString() : null,
    end: item?.current_period_end ? new Date(item.current_period_end * 1000).toISOString() : null,
  };
}

async function syncSubscription(sub: Stripe.Subscription) {
  const userId = sub.metadata?.supabase_user_id;
  if (!userId) return;
  const period = getPeriod(sub);
  await upsertSubscription({
    user_id: userId,
    stripe_customer_id: sub.customer as string,
    stripe_subscription_id: sub.id,
    status: sub.status as "trialing" | "active" | "past_due" | "canceled" | "unpaid",
    plan_id: "invoice_extractor_monthly",
    trial_ends_at: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
    current_period_start: period.start,
    current_period_end: period.end,
    cancel_at_period_end: sub.cancel_at_period_end,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature") ?? "";

  if (!STRIPE_WEBHOOK_SECRET) {
    console.error("[stripe/webhook] STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[stripe/webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;

        if (session.mode === "subscription") {
          const subscriptionId = session.subscription as string;
          if (!userId || !subscriptionId) break;
          const sub = await stripe.subscriptions.retrieve(subscriptionId, { expand: ["items"] });
          await syncSubscription(sub);
          console.log("[webhook] checkout.session.completed (subscription) userId:", userId);
        } else if (session.mode === "payment" && session.metadata?.product_type === "ai_quota_topup") {
          // One-time top-up payment completed
          if (!userId) break;
          const quotaAmount = parseInt(session.metadata?.quota_amount ?? "1000", 10);
          const amountAud = (session.amount_total ?? 2000) / 100;
          await addTopupQuota(userId, quotaAmount, session.id, amountAud);
          console.log("[webhook] ai_quota_topup userId:", userId, "quota:", quotaAmount);
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        await syncSubscription(sub);
        console.log("[webhook] subscription.updated status:", sub.status);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.supabase_user_id;
        if (!userId) break;
        await upsertSubscription({
          user_id: userId,
          stripe_customer_id: sub.customer as string,
          stripe_subscription_id: sub.id,
          status: "canceled",
          plan_id: "invoice_extractor_monthly",
          trial_ends_at: null,
          current_period_start: null,
          current_period_end: null,
          cancel_at_period_end: false,
        });
        console.log("[webhook] subscription.deleted userId:", userId);
        break;
      }

      case "invoice.payment_succeeded":
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const parentDetails = invoice.parent as { subscription_details?: { subscription?: string } } | null;
        const subscriptionId = parentDetails?.subscription_details?.subscription;
        if (!subscriptionId) break;
        const sub = await stripe.subscriptions.retrieve(subscriptionId, { expand: ["items"] });
        await syncSubscription(sub);
        // On successful monthly renewal, reset AI quota
        if (event.type === "invoice.payment_succeeded") {
          const userId = sub.metadata?.supabase_user_id;
          if (userId) {
            await resetMonthlyQuota(userId);
            console.log("[webhook] monthly quota reset for userId:", userId);
          }
        }
        console.log("[webhook]", event.type, "sub:", subscriptionId);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error(`[stripe/webhook] error handling ${event.type}:`, err);
    return NextResponse.json({ received: true, warning: "Handler error" });
  }

  return NextResponse.json({ received: true });
}
