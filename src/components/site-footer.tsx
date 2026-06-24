"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

export function SiteFooter() {
  const { lang } = useLanguage();
  const zh = lang === "zh";

  return (
    <footer className="border-t border-white/10 py-10 text-center text-[10px] tracking-[0.3em] text-slate-500">
      <div className="space-y-3 px-6">
        <p>&copy; 2026 ArkAgentic. ABN: 92 627 301 153</p>
        <p>
          {zh
            ? "澳大利亚新南威尔士州 帕拉马塔 哈萨尔街 11 号 2150"
            : "11 Hassall Street, Parramatta NSW 2150"}
        </p>
        <div className="flex items-center justify-center gap-6 pt-1">
          <Link href="/terms" className="hover:text-slate-300 transition-colors">
            {zh ? "使用条款" : "Terms of Service"}
          </Link>
          <span className="opacity-30">&middot;</span>
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">
            {zh ? "隐私政策" : "Privacy Policy"}
          </Link>
          <span className="opacity-30">&middot;</span>
          <a href="mailto:support@arkagentic.com" className="hover:text-slate-300 transition-colors">
            {zh ? "联系客服" : "Support"}
          </a>
        </div>
      </div>
    </footer>
  );
}
