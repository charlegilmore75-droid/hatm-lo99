"use client";
import Nav from "@/components/Nav";
import Link from "next/link";
import { useLang } from "@/lib/lang";
import { useEffect, useState } from "react";

export default function Home() {
  const { t } = useLang();
  const [buttons, setButtons] = useState<any[]>([]);
  const [banner, setBanner] = useState("");
  useEffect(() => {
    fetch("/api/site").then(r => r.json()).then(d => { setButtons(d.buttons || []); setBanner(d.banner || ""); });
  }, []);
  return (
    <div className="min-h-screen">
      <Nav />
      <section className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          <span className="text-accent">HATM</span>
        </h1>
        <p className="text-xl text-muted mb-8">{t("tagline")}</p>
        {banner && <div className="card p-4 mb-8 text-accent">{banner}</div>}
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/services" className="btn btn-primary">{t("browseServices")}</Link>
          <Link href="/register" className="btn btn-ghost">{t("getStarted")}</Link>
          {buttons.filter(b => b.active).map(b => (
            <a key={b.id} href={b.url} target="_blank" rel="noreferrer" className="btn btn-ghost">{b.label}</a>
          ))}
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-4 pb-20 grid md:grid-cols-3 gap-4">
        {["⚡ تسليم سريع","💰 أسعار منافسة","🛡️ أمان وموثوقية"].map((f, i) => (
          <div key={i} className="card p-6 text-center"><div className="text-2xl">{f}</div></div>
        ))}
      </section>
    </div>
  );
}
