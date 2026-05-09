"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { dict, Lang } from "./i18n";

const Ctx = createContext<{ lang: Lang; t: (k: keyof typeof dict.ar) => string; setLang: (l: Lang) => void }>({
  lang: "ar", t: (k) => dict.ar[k] as string, setLang: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");
  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("lang")) as Lang | null;
    if (stored === "ar" || stored === "en") setLangState(stored);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  const setLang = (l: Lang) => { localStorage.setItem("lang", l); setLangState(l); };
  const t = (k: keyof typeof dict.ar) => (dict[lang] as any)[k] || (dict.ar as any)[k] || k;
  return <Ctx.Provider value={{ lang, t, setLang }}>{children}</Ctx.Provider>;
}
export const useLang = () => useContext(Ctx);
