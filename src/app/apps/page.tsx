"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AppsOverview } from "@/components/apps-overview";
import { useLanguage } from "@/components/language-provider";

function SuccessBanner() {
  const { lang } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isTrial, setIsTrial] = useState(false);

  useEffect(() => {
    const subParam = searchParams.get("subscription");
    if (subParam === "success" || subParam === "trial") {
      setShowSuccess(true);
      setIsTrial(subParam === "trial");
      router.replace("/apps", { scroll: false });
      const timer = setTimeout(() => setShowSuccess(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  if (!showSuccess) return null;

  const bodyZh = isTrial
    ? "您的 7 天免费试用已开始，点击下方按钮进入应用。"
    : "您已成功订阅，点击下方按钮进入应用。";
  const bodyEn = isTrial
    ? "Your 7-day free trial has started. Click Launch app below to get started."
    : "Your subscription is active. Click Launch app below to get started.";

  return (
    <div className="mb-8 flex items-start gap-4 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-6 py-5">
      <span className="mt-0.5 text-xl">🎉</span>
      <div>
        <p className="font-semibold text-emerald-100">
          {lang === "zh" ? "订阅成功！" : "You're all set!"}
        </p>
        <p className="mt-1 text-sm text-emerald-200/80">
          {lang === "zh" ? bodyZh : bodyEn}
        </p>
      </div>
      <button
        onClick={() => setShowSuccess(false)}
        className="ml-auto text-emerald-300/60 hover:text-emerald-200"
      >
        ✕
      </button>
    </div>
  );
}

export default function AppsPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <Suspense fallback={null}>
        <SuccessBanner />
      </Suspense>
      <div className="max-w-3xl">
        <h1 className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-200/80">{t.apps.heading}</h1>
      </div>
      <div className="mt-10">
        <AppsOverview />
      </div>
    </div>
  );
}
