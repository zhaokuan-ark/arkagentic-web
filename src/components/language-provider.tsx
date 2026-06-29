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
    // Cookie takes priority — it's the shared signal across both subdomains.
    // If the user changed language in invoice extractor, the cookie reflects that
    // and should override the stale localStorage value on this site.
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
      try {
        document.cookie = `arklang=${resolved}; domain=.arkagentic.com; path=/; max-age=31536000; SameSite=Lax`;
      } catch (_) {}
    }
  }, []);

  function setLang(l: Language) {
    setLangState(l);
    localStorage.setItem("arkagentic-lang", l);
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
