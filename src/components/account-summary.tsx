"use client";

import Link from "next/link";
import { useAuthSession } from "@/components/auth-session-provider";
import { useLanguage } from "@/components/language-provider";
import { useSubscription, openBillingPortal, startTopupCheckout } from "@/hooks/useSubscription";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useState } from "react";

function StatusBadge({ status, zh }: { status: string | null; zh: boolean }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        {zh ? "订阅活跃" : "Active"}
      </span>
    );
  }
  if (status === "trialing") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
        {zh ? "免费试用" : "Free trial"}
      </span>
    );
  }
  if (status === "past_due") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300">
        <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
        {zh ? "付款失败" : "Payment failed"}
      </span>
    );
  }
  if (status === "canceled") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-400">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
        {zh ? "已取消" : "Canceled"}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-400">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
      {zh ? "无有效订阅" : "No active plan"}
    </span>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
}

export function AccountSummary() {
  const { isConfigured, isDemoMode, isLoading, session, user } = useAuthSession();
  const { lang } = useLanguage();
  const {
    loading: subLoading,
    status,
    hasAccess,
    trialDaysLeft,
    currentPeriodEnd,
    cancelAtPeriodEnd,
    aiQuotaRemaining,
    aiQuotaMonthly,
  } = useSubscription();

  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);
  const [topupLoading, setTopupLoading] = useState(false);

  const zh = lang === "zh";

  async function getToken(): Promise<string> {
    let token = session?.access_token;
    if (!token) {
      const sb = getSupabaseBrowserClient();
      if (!sb) throw new Error("Auth not available");
      const { data } = await sb.auth.getSession();
      token = data.session?.access_token;
    }
    if (!token) throw new Error("Please sign in again.");
    return token;
  }

  async function handleManageBilling() {
    setPortalError(null);
    setPortalLoading(true);
    try {
      await openBillingPortal(await getToken());
    } catch (err) {
      setPortalError((err as Error).message);
      setPortalLoading(false);
    }
  }

  async function handleTopup() {
    setTopupLoading(true);
    try {
      await startTopupCheckout(await getToken());
    } catch (err) {
      alert((err as Error).message);
      setTopupLoading(false);
    }
  }

  if (!isConfigured && !isDemoMode) {
    return (
      <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-6 text-amber-100">
        {zh ? "尚未配置认证服务。" : "No auth provider is configured yet."}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6 text-slate-400">
        {zh ? "正在加载账户信息..." : "Loading your account..."}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6">
        <p className="text-slate-300">{zh ? "你尚未登录。" : "You are not signed in."}</p>
        <div className="mt-4 flex gap-3">
          <Link href="/signin" className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-500">
            {zh ? "登录" : "Sign in"}
          </Link>
          <Link href="/signup" className="rounded-xl border border-white/15 px-4 py-2 font-medium text-white transition hover:bg-white/5">
            {zh ? "创建账户" : "Create account"}
          </Link>
        </div>
      </div>
    );
  }

  const initials = user.email ? user.email[0].toUpperCase() : "?";

  return (
    <div className="space-y-4">
      {/* Profile row */}
      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-white">{user.email}</p>
          <p className="mt-0.5 text-sm text-slate-400">
            {zh ? "注册账户" : "ArkAgentic account"}
          </p>
        </div>
      </div>

      {/* Subscription section */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          {zh ? "订阅与账单" : "Subscription & billing"}
        </p>

        {subLoading ? (
          <p className="mt-4 text-sm text-slate-500">{zh ? "加载中…" : "Loading…"}</p>
        ) : (
          <>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {/* Plan */}
              <div>
                <p className="text-xs text-slate-500">{zh ? "当前套餐" : "Current plan"}</p>
                <p className="mt-1.5 text-base font-semibold text-white">Invoice Extractor</p>
                <div className="mt-2"><StatusBadge status={status} zh={zh} /></div>
              </div>

              {/* Price */}
              <div>
                <p className="text-xs text-slate-500">{zh ? "价格" : "Price"}</p>
                <p className="mt-1.5 font-semibold text-white">
                  {hasAccess ? (
                    <><span className="text-2xl">$15</span><span className="text-sm text-slate-400"> AUD / month</span></>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </p>
              </div>

              {/* Trial / renewal info */}
              <div>
                <p className="text-xs text-slate-500">
                  {status === "trialing" ? (zh ? "试用到期" : "Trial ends") : (zh ? "下次续费" : "Next billing date")}
                </p>
                <p className="mt-1.5 text-sm text-slate-300">
                  {status === "trialing"
                    ? (trialDaysLeft !== null
                        ? (zh ? `剩余 ${trialDaysLeft} 天` : `${trialDaysLeft} day${trialDaysLeft === 1 ? "" : "s"} remaining`)
                        : formatDate(currentPeriodEnd))
                    : status === "active"
                    ? (cancelAtPeriodEnd
                        ? `Cancels ${formatDate(currentPeriodEnd)}`
                        : formatDate(currentPeriodEnd))
                    : <span className="italic text-slate-500">{zh ? "—" : "—"}</span>
                  }
                </p>
              </div>

              {/* Status note */}
              <div>
                <p className="text-xs text-slate-500">{zh ? "状态说明" : "Status"}</p>
                <p className="mt-1.5 text-sm text-slate-300">
                  {status === "trialing" && zh ? "试用期内不扣款" : null}
                  {status === "trialing" && !zh ? "No charge during trial" : null}
                  {status === "active" && !cancelAtPeriodEnd && (zh ? "订阅活跃" : "Subscription active")}
                  {status === "active" && cancelAtPeriodEnd && (zh ? "已设置取消" : "Cancellation scheduled")}
                  {status === "past_due" && (zh ? "付款失败，请更新付款方式" : "Payment failed — please update payment method")}
                  {(!status || status === "canceled") && (zh ? "无有效订阅" : "No active subscription")}
                </p>
              </div>
            </div>

            {/* Billing action */}
            {portalError && (
              <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{portalError}</p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              {hasAccess ? (
                <button
                  type="button"
                  onClick={handleManageBilling}
                  disabled={portalLoading}
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:opacity-60"
                >
                  {portalLoading ? (zh ? "跳转中…" : "Redirecting…") : (zh ? "管理账单" : "Manage billing")}
                </button>
              ) : (
                <Link
                  href="/apps"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  {zh ? "开始免费试用" : "Start free trial"}
                </Link>
              )}
              <Link
                href="/apps"
                className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/25 hover:bg-white/5"
              >
                {zh ? "前往应用" : "Go to apps"}
              </Link>
            </div>

            {/* AI Quota section */}
            {hasAccess && aiQuotaRemaining !== null && aiQuotaMonthly !== null && (
              <div className="mt-6 border-t border-white/[0.08] pt-6">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {zh ? "AI 处理额度" : "AI Processing Quota"}
                </p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{zh ? "本月剩余" : "Remaining this month"}</span>
                    <span className={`font-semibold tabular-nums ${
                      aiQuotaRemaining < 20 ? "text-amber-400" : "text-white"
                    }`}>
                      {aiQuotaRemaining.toLocaleString()}
                      <span className="font-normal text-slate-500"> / {aiQuotaMonthly.toLocaleString()}</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
                    <div
                      className={`h-full rounded-full transition-all ${
                        aiQuotaRemaining / aiQuotaMonthly < 0.15 ? "bg-amber-400" : "bg-blue-500"
                      }`}
                      style={{ width: `${Math.min(100, Math.round((aiQuotaRemaining / aiQuotaMonthly) * 100))}%` }}
                    />
                  </div>
                  {aiQuotaRemaining < 20 && (
                    <p className="text-xs text-amber-400">
                      {zh ? "额度较低，建议充值。" : "Running low — consider topping up."}
                    </p>
                  )}
                  <div className="mt-2 flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {zh ? "充值 1,000 张额度" : "Top up 1,000 credits"}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {zh ? "$20 AUD · 一次性 · 永不过期" : "$20 AUD · one-time · never expires"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleTopup}
                      disabled={topupLoading}
                      className="ml-4 shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-50"
                    >
                      {topupLoading ? (zh ? "跳转中…" : "Redirecting…") : (zh ? "充值" : "Top up")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Legal links */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-6 py-4">
        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
          <Link href="/terms" className="hover:text-slate-300 transition-colors">{zh ? "服务条款" : "Terms of Service"}</Link>
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">{zh ? "隐私政策" : "Privacy Policy"}</Link>
        </div>
      </div>
    </div>
  );
}
