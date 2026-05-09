"use client";
import Nav from "@/components/Nav";
import { useLang } from "@/lib/lang";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { t } = useLang();
  const [me, setMe] = useState<any>(null);
  const [pwd, setPwd] = useState(""); const [msg, setMsg] = useState("");
  useEffect(() => { fetch("/api/me").then(r => r.json()).then(d => setMe(d.user)); }, []);
  const change = async (e: any) => {
    e.preventDefault();
    const r = await fetch("/api/me/password", { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ password: pwd }) });
    setMsg(r.ok ? "✅" : "Error"); setPwd("");
  };
  if (!me) return <div className="min-h-screen"><Nav /></div>;
  return (
    <div className="min-h-screen"><Nav />
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold">{t("profile")}</h1>
        <div className="card p-6 grid sm:grid-cols-3 gap-4">
          <div><div className="text-muted text-sm">{t("username")}</div><div className="font-bold">{me.username}</div></div>
          <div><div className="text-muted text-sm">{t("email")}</div><div className="font-bold">{me.email}</div></div>
          <div><div className="text-muted text-sm">{t("balance")}</div><div className="font-bold text-accent">${me.balance.toFixed(2)}</div></div>
          <div><div className="text-muted text-sm">{t("totalSpent")}</div><div className="font-bold">${me.totalSpent.toFixed(2)}</div></div>
        </div>
        <form onSubmit={change} className="card p-6 space-y-3">
          <h2 className="text-xl font-bold">{t("changePassword")}</h2>
          <input type="password" className="input" value={pwd} onChange={e=>setPwd(e.target.value)} minLength={6} required />
          {msg && <div className="text-sm">{msg}</div>}
          <button className="btn btn-primary">{t("save")}</button>
        </form>
      </div>
    </div>
  );
}
