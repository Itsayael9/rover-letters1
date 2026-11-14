"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { STRINGS } from "@/i18n/strings";

const LangContext = createContext({ lang: "en", setLang: () => {}, t: STRINGS.en });

export function LangProvider({ children }) {
  const [lang, setLang] = useState("en");

  // read the saved language once
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rl-lang");
      if (saved === "en" || saved === "ar") setLang(saved);
    } catch {}
  }, []);

  // flip the whole page direction when the language changes
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem("rl-lang", lang);
    } catch {}
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t: STRINGS[lang] }), [lang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);