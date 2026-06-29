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

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const stored = localStorage.getItem("arkagentic-lang") as Language | null;
    if (stored === "zh" || stored === "en") { setLangState(stored); return; }
    // Fallback: read shared cookie written by app.arkagentic.com
    try {
      const m = document.cookie.match(/(?:^|;\s*)arklang=([^;]+)/);
      const cookieLang = m ? m[1].trim() : null;
      if (cookieLang === "zh" || cookieLang === "en") setLangState(cookieLang as Language);
    } catch (_) {}
  }, []);

  function setLang(l: Language) {
    setLangState(l);
    localStorage.setItem("arkagentic-lang", l);
    // Also write shared cookie so app.arkagentic.com picks it up
    try {
      document.cookie = `arklang=${l}; domain=.arkagentic.com; path=/; max-age=31536000; SameSite=Lax`;
    } catch (_) {}
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
