"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useLanguage } from "@/components/language-provider";

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { t, lang } = useLanguage();
  const zh = lang === "zh";
  const p = t.pricing;

  async function handleStartTrial() {
    setLoading(true);
    setError(null);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) { router.push("/signin?next=/pricing"); return; }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/signin?next=/pricing"); return; }
    try {
      const res = await fetch("/api/billing/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ noTrial: false }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) { router.push("/apps"); return; }
        if (data.noTrial) { router.push("/apps"); return; }
        setError(data.error ?? (zh ? "出错了，请重试。" : "Something went wrong. Please try again."));
        return;
      }
      if (data.url) window.location.href = data.url;
    } catch {
      setError(zh ? "网络错误，请重试。" : "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const plans = [
    {
      name: p.plans[0].name,
      price: p.plans[0].price,
      description: p.plans[0].description,
      features: p.plans[0].features,
      cardClassName: "border-white/10 bg-white/5",
      eyebrowClassName: "text-blue-200/80",
      cta: p.ctaTrial,
      ctaClassName: "bg-blue-600 hover:bg-blue-500 text-white",
      hasCheckout: true,
    },
    {
      name: p.plans[1].name,
      price: p.plans[1].price,
      description: p.plans[1].description,
      features: p.plans[1].features,
      cardClassName: "border-cyan-400/20 bg-cyan-500/10",
      eyebrowClassName: "text-cyan-200/85",
      cta: p.ctaContact,
      ctaClassName: "bg-white/10 hover:bg-white/20 text-white border border-white/20",
      hasCheckout: false,
      href: "mailto:support@arkagentic.com",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-white font-heading md:text-5xl">{p.eyebrow}</h1>
        <p className="mt-4 text-lg text-slate-300">{p.subheading}</p>
      </div>

      {error && (
        <div className="mx-auto mt-8 max-w-md rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-center text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <div key={plan.name} className={`rounded-3xl border p-8 flex flex-col ${plan.cardClassName}`}>
            <p className={`text-sm uppercase tracking-[0.3em] ${plan.eyebrowClassName}`}>{plan.name}</p>
            <h2 className="mt-4 text-4xl font-bold text-white">{plan.price}</h2>
            <p className="mt-4 text-slate-300">{plan.description}</p>
            <ul className="mt-6 space-y-3 text-slate-200 flex-1">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <div className="mt-8">
              {plan.hasCheckout ? (
                <button
                  onClick={handleStartTrial}
                  disabled={loading}
                  className={`w-full rounded-full px-6 py-3 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${plan.ctaClassName}`}
                >
                  {loading ? (zh ? "跳转中…" : "Redirecting…") : plan.cta}
                </button>
              ) : (
                <a
                  href={(plan as { href?: string }).href}
                  className={`block w-full rounded-full px-6 py-3 text-center text-sm font-semibold transition ${plan.ctaClassName}`}
                >
                  {plan.cta}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
