// GET /api/billing/status
// Returns the current user's subscription status.

import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, getSubscriptionByUserId, getAiQuota } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const sub = await getSubscriptionByUserId(user.id);
    if (!sub) {
      return NextResponse.json({ status: null, hasAccess: false });
    }

    const hasAccess = sub.status === "trialing" || sub.status === "active";
    const trialDaysLeft = sub.trial_ends_at
      ? Math.max(0, Math.ceil((new Date(sub.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : null;

    const quota = hasAccess ? await getAiQuota(user.id) : null;

    return NextResponse.json({
      status: sub.status,
      hasAccess,
      trialDaysLeft: sub.status === "trialing" ? trialDaysLeft : null,
      currentPeriodEnd: sub.current_period_end,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
      planId: sub.plan_id,
      aiQuotaRemaining: quota?.remaining ?? null,
      aiQuotaMonthly: quota?.monthly ?? null,
      aiQuotaMonthlyRemaining: quota?.monthlyRemaining ?? null,
      aiQuotaTopupRemaining: quota?.topupRemaining ?? null,
      aiQuotaTopupTotal: quota?.topupTotal ?? null,
    });
  } catch (err) {
    console.error("[billing/status] error:", err);
    return NextResponse.json({ error: "Failed to fetch subscription status" }, { status: 500 });
  }
}
