"use client";
import Link from "next/link";
import { useLang } from "@/lib/lang";
import { useEffect, useState } from "react";

export default function Nav() {
  const { t, lang, setLang } = useLang();
  const [me, setMe] = useState<any>(null);
  useEffect(() => { fetch("/api/me").then(r => r.json()).then(d => setMe(d.user)); }, []);
  return (
    <header className="border-b border-border bg-panel sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="text-2xl font-extrabold text-accent">HATM</Link>
        <nav className="hidden md:flex items-center gap-5 text-sm">
          <Link href="/services">{t("services")}</Link>
          {me && <Link href="/orders">{t("orders")}</Link>}
          {me && <Link href="/topup">{t("topup")}</Link>}
          {me && <Link href="/profile">{t("profile")}</Link>}
          {me?.role === "ADMIN" && <Link href="/admin" className="text-accent">{t("admin")}</Link>}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="btn btn-ghost text-xs">
            {lang === "ar" ? "EN" : "ع"}
          </button>
          {me ? (
            <>
              <span className="hidden sm:inline text-sm text-muted">{t("balance")}: <b className="text-accent">${me.balance.toFixed(2)}</b></span>
              <form action="/api/auth/logout" method="post"><button className="btn btn-ghost text-xs">{t("logout")}</button></form>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost text-xs">{t("login")}</Link>
              <Link href="/register" className="btn btn-primary text-xs">{t("register")}</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
