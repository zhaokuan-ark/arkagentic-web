"use client";

import { Suspense, useState } from "react";
import { useAuthSession } from "@/components/auth-session-provider";
import { useSubscription, startCheckout, openBillingPortal, startTopupCheckout } from "@/hooks/useSubscription";
import { useSearchParams } from "next/navigation";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}

function QuotaBar({ remaining, total }: { remaining: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.round((remaining / total) * 100)) : 0;
  const isLow = pct < 15;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-400">AI 额度剩余</span>
        <span className={`font-semibold tabular-nums ${isLow ? "text-amber-400" : "text-white"}`}>
          {remaining.toLocaleString()} <span className="text-zinc-500 font-normal">/ {total.toLocaleString()} 张</span>
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${isLow ? "bg-amber-400" : "bg-blue-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {isLow && (
        <p className="text-xs text-amber-400">额度较低，建议充值以免影响提取服务。</p>
      )}
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
      <BillingContent />
    </Suspense>
  );
}

function BillingContent() {
  const { session } = useAuthSession();
  const { loading, status, hasAccess, currentPeriodEnd, cancelAtPeriodEnd, aiQuotaRemaining, aiQuotaMonthly, refresh } = useSubscription();
  const searchParams = useSearchParams();
  const topupResult = searchParams.get("topup");
  const subResult = searchParams.get("subscription");

  const [portalLoading, setPortalLoading] = useState(false);
  const [topupLoading, setTopupLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const accessToken = session?.access_token ?? "";

  async function handlePortal() {
    if (!accessToken) return;
    setPortalLoading(true);
    try { await openBillingPortal(accessToken); }
    finally { setPortalLoading(false); }
  }

  async function handleTopup() {
    if (!accessToken) return;
    setTopupLoading(true);
    try { await startTopupCheckout(accessToken); }
    catch (e) { alert((e as Error).message); setTopupLoading(false); }
  }

  async function handleCheckout() {
    if (!accessToken) return;
    setCheckoutLoading(true);
    try { await startCheckout(accessToken); }
    catch (e) { alert((e as Error).message); setCheckoutLoading(false); }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-xl mx-auto px-6 py-16 space-y-6">

        {/* Page title */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">账单与额度</h1>
          <p className="text-sm text-zinc-500">管理订阅及 AI 处理额度。</p>
        </div>

        {/* Success banners */}
        {topupResult === "success" && (
          <div className="rounded-xl bg-emerald-950/60 border border-emerald-800/50 px-4 py-3 text-sm text-emerald-300">
            ✓ 充值成功！1,000 张 AI 额度已添加到你的账户。
          </div>
        )}
        {subResult === "trial" && (
          <div className="rounded-xl bg-blue-950/60 border border-blue-800/50 px-4 py-3 text-sm text-blue-300">
            ✓ 订阅成功！7 天免费试用已开始，200 张 AI 额度已就绪。
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 animate-pulse h-40" />
        ) : hasAccess ? (
          <>
            {/* ── Current plan card ── */}
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium">当前套餐</p>
                  <p className="text-lg font-semibold">Invoice Extractor</p>
                  <p className="text-sm text-zinc-400">
                    <span className="text-white font-semibold">$15</span>
                    <span className="text-zinc-500"> AUD / 月</span>
                    {" · "}
                    <span className={`capitalize ${status === "trialing" ? "text-blue-400" : "text-emerald-400"}`}>
                      {status === "trialing" ? "试用中" : "订阅中"}
                    </span>
                  </p>
                </div>
                <button
                  onClick={handlePortal}
                  disabled={portalLoading}
                  className="shrink-0 text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
                >
                  {portalLoading ? "跳转中…" : "管理"}
                </button>
              </div>

              {/* Quota bar */}
              {aiQuotaRemaining !== null && aiQuotaMonthly !== null && (
                <QuotaBar remaining={aiQuotaRemaining} total={aiQuotaMonthly} />
              )}

              {/* Renewal info */}
              {currentPeriodEnd && (
                <p className="text-xs text-zinc-600">
                  {cancelAtPeriodEnd ? "到期停止：" : "下次续费："}{formatDate(currentPeriodEnd)}
                  {!cancelAtPeriodEnd && " · 届时额度重置为 200 张"}
                </p>
              )}
            </div>

            {/* ── Top-up card ── */}
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-base font-semibold">AI 额度充值</p>
                  <p className="text-sm text-zinc-400">
                    <span className="text-white font-semibold">$20 AUD</span>
                    {" · 一次性 · "}
                    <span className="text-white font-semibold">+1,000 张</span>
                    {" AI 处理额度"}
                  </p>
                  <p className="text-xs text-zinc-600">额度永不过期，叠加在月度额度之上。</p>
                </div>
                <button
                  onClick={handleTopup}
                  disabled={topupLoading}
                  className="shrink-0 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 transition-colors disabled:opacity-50"
                >
                  {topupLoading ? "跳转中…" : "充值"}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* ── No subscription ── */
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-4">
            <div className="space-y-1">
              <p className="text-base font-semibold">Invoice Extractor</p>
              <p className="text-sm text-zinc-400">订阅以使用 AI 发票提取功能。</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold">$15</span>
                <span className="text-zinc-400 text-sm">AUD / 月</span>
              </div>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>✓ 无限次规则提取</li>
                <li>✓ 每月 200 张 AI 辅助额度</li>
                <li>✓ OneDrive 云盘直连</li>
                <li>✓ Excel / CSV 导出</li>
              </ul>
            </div>
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="w-full text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2.5 transition-colors disabled:opacity-50"
            >
              {checkoutLoading ? "跳转中…" : "开始 7 天免费试用"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
