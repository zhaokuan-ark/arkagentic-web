"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { type Language, type Translations, translations } from "@/lib/i18n";

type LanguageContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
  t: translations["en"],
});

function writeSharedLangCookie(l: string) {
  try {
    // Clear any subdomain-specific leftover first, then write shared parent-domain cookie
    document.cookie = "arklang=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = `arklang=${l}; domain=.arkagentic.com; path=/; max-age=31536000; SameSite=Lax`;
  } catch (_) {}
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    // Cookie takes priority — it's the shared signal across both subdomains.
    let resolved: Language | null = null;
    try {
      const m = document.cookie.match(/(?:^|;\s*)arklang=([^;]+)/);
      const cookieLang = m ? m[1].trim() : null;
      if (cookieLang === "zh" || cookieLang === "en") resolved = cookieLang as Language;
    } catch (_) {}
    if (!resolved) {
      const stored = localStorage.getItem("arkagentic-lang") as Language | null;
      if (stored === "zh" || stored === "en") resolved = stored;
    }
    if (resolved) {
      setLangState(resolved);
      localStorage.setItem("arkagentic-lang", resolved);
      writeSharedLangCookie(resolved);
    }
  }, []);

  function setLang(l: Language) {
    setLangState(l);
    localStorage.setItem("arkagentic-lang", l);
    writeSharedLangCookie(l);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
