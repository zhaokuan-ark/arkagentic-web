"use client";

import Link from "next/link";
import { useAuthSession } from "@/components/auth-session-provider";
import { useLanguage } from "@/components/language-provider";

// Placeholder subscription data — will be wired to Stripe/DB later
const SUBSCRIPTION_PLACEHOLDER = {
  plan: "Invoice Extractor",
  status: "trial" as "active" | "trial" | "inactive",
  trialEndsAt: null as string | null, // e.g. "2026-07-01"
  billingAmount: "$19",
  billingCycle: "/ month",
  nextBillingDate: null as string | null,
  paymentMethod: null as string | null, // e.g. "Visa •••• 4242"
};

function StatusBadge({ status }: { status: "active" | "trial" | "inactive" }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Active
      </span>
    );
  }
  if (status === "trial") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
        Free trial
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-400">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
      No active plan
    </span>
  );
}

export function AccountSummary() {
  const { isConfigured, isDemoMode, isLoading, user } = useAuthSession();
  const { lang } = useLanguage();

  const zh = lang === "zh";

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

  const sub = SUBSCRIPTION_PLACEHOLDER;
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

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {/* Plan */}
          <div>
            <p className="text-xs text-slate-500">{zh ? "当前套餐" : "Current plan"}</p>
            <p className="mt-1.5 text-base font-semibold text-white">{sub.plan}</p>
            <div className="mt-2">
              <StatusBadge status={sub.status} />
            </div>
          </div>

          {/* Price */}
          <div>
            <p className="text-xs text-slate-500">{zh ? "价格" : "Price"}</p>
            <p className="mt-1.5 text-base font-semibold text-white">
              {sub.status === "inactive" ? (
                <span className="text-slate-400">{zh ? "—" : "—"}</span>
              ) : (
                <>
                  <span className="text-2xl">{sub.billingAmount}</span>
                  <span className="text-sm text-slate-400">{sub.billingCycle}</span>
                </>
              )}
            </p>
          </div>

          {/* Next billing date */}
          <div>
            <p className="text-xs text-slate-500">{zh ? "下次扣款日期" : "Next billing date"}</p>
            <p className="mt-1.5 text-sm text-slate-300">
              {sub.nextBillingDate ?? (
                <span className="text-slate-500 italic">{zh ? "试用期内暂不扣款" : "Not applicable during trial"}</span>
              )}
            </p>
          </div>

          {/* Payment method */}
          <div>
            <p className="text-xs text-slate-500">{zh ? "付款方式" : "Payment method"}</p>
            <p className="mt-1.5 text-sm text-slate-300">
              {sub.paymentMethod ?? (
                <span className="text-slate-500 italic">{zh ? "尚未添加" : "Not added yet"}</span>
              )}
            </p>
          </div>
        </div>

        {/* CTA when no active subscription */}
        {sub.status !== "active" && (
          <div className="mt-6 rounded-xl border border-blue-400/15 bg-blue-500/[0.07] p-4">
            <p className="text-sm text-slate-300">
              {zh
                ? "订阅后即可使用 Invoice Extractor 的全部功能。"
                : "Subscribe to unlock full access to Invoice Extractor and all future ArkAgentic products."}
            </p>
            <Link
              href="/pricing"
              className="mt-3 inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              {zh ? "查看套餐" : "View plans"}
            </Link>
          </div>
        )}
      </div>

      {/* Danger zone / sign out */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{zh ? "账户操作" : "Account"}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/apps"
            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/25 hover:bg-white/5"
          >
            {zh ? "前往应用" : "Go to apps"}
          </Link>
        </div>
      </div>
    </div>
  );
}
