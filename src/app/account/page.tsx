"use client";

import { Suspense } from "react";
import { AccountSummary } from "@/components/account-summary";
import { useLanguage } from "@/components/language-provider";
import { useSearchParams } from "next/navigation";

function TopupBanner() {
  const searchParams = useSearchParams();
  const topup = searchParams.get("topup");
  if (topup !== "success") return null;
  return (
    <div className="mb-6 rounded-xl border border-emerald-700/40 bg-emerald-950/50 px-5 py-3.5 text-sm text-emerald-300">
      ✓ Top-up successful — 1,000 AI credits have been added to your account.
    </div>
  );
}

export default function AccountPage() {
  const { lang } = useLanguage();
  const zh = lang === "zh";

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <p className="text-sm uppercase tracking-[0.35em] text-blue-200/80">
        {zh ? "账户" : "Account"}
      </p>
      <h1 className="mt-4 font-heading text-4xl font-bold text-white">
        {zh ? "我的账户" : "My account"}
      </h1>
      <div className="mt-8">
        <Suspense fallback={null}>
          <TopupBanner />
        </Suspense>
        <AccountSummary />
      </div>
    </div>
  );
}
