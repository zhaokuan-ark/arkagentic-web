"use client";

import { AccountSummary } from "@/components/account-summary";
import { useLanguage } from "@/components/language-provider";

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
        <AccountSummary />
      </div>
    </div>
  );
}
