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
    if (stored === "zh" || stored === "en") setLangState(stored);
  }, []);

  function setLang(l: Language) {
    setLangState(l);
    localStorage.setItem("arkagentic-lang", l);
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
