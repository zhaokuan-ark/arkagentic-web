"use client";

import { useState } from "react";
import { useLanguage } from "@/components/language-provider";

const SUPPORT_EMAIL = "support@arkagentic.com";

import { type ReactElement } from "react";

const topicIcons: Record<number, ReactElement> = {
  0: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 12.2a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /><path d="M5.4 20a6.8 6.8 0 0 1 13.2 0" />
    </svg>
  ),
  1: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
    </svg>
  ),
  2: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 3" />
    </svg>
  ),
  3: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
    </svg>
  ),
};

export default function SupportPage() {
  const { t } = useLanguage();
  const s = t.support;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const inputCls =
    "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20";

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-blue-300/80">{s.eyebrow}</p>
          <h1 className="mt-4 font-heading text-4xl font-bold text-white sm:text-5xl">{s.heading}</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-400">{s.description}</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          {/* Left: topic cards */}
          <div className="space-y-3">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              {t.lang["en"] === "English" ? "Common topics" : "常见问题类型"}
            </p>
            {s.topics.map((topic, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3.5 text-sm text-slate-300"
              >
                <span className="text-blue-400">{topicIcons[i]}</span>
                {topic}
              </div>
            ))}

            {/* Direct email fallback */}
            <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                {t.lang["en"] === "English" ? "Prefer email?" : "也可直接发邮件"}
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="mt-2 block text-sm font-medium text-blue-300 transition hover:text-blue-200"
              >
                {SUPPORT_EMAIL}
              </a>
            </div>
          </div>

          {/* Right: form */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-blue-500/10 via-transparent to-fuchsia-500/10 blur-2xl" />
            <div className="relative rounded-[2rem] border border-white/10 bg-slate-900/60 p-8 backdrop-blur-xl shadow-[0_20px_80px_rgba(2,6,23,0.6)]">
              {status === "success" ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 13 4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{s.form.successHeading}</h2>
                  <p className="mt-3 max-w-sm text-slate-400">{s.form.successBody}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name + Email */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-400">{s.form.name}</label>
                      <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={s.form.namePlaceholder}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-400">{s.form.email}</label>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={s.form.emailPlaceholder}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {/* Topic */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">{s.form.topic}</label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className={`${inputCls} appearance-none`}
                    >
                      <option value="" className="bg-slate-900">{s.form.topicPlaceholder}</option>
                      {s.topics.map((tp, i) => (
                        <option key={i} value={tp} className="bg-slate-900">{tp}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">{s.form.message}</label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={s.form.messagePlaceholder}
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  {/* Error */}
                  {status === "error" && (
                    <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {s.form.errorBody}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full rounded-2xl bg-blue-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
                  >
                    {status === "sending" ? s.form.sending : s.form.submit}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
