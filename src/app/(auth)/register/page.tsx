"use client";
import Nav from "@/components/Nav";
import { useLang } from "@/lib/lang";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const { t } = useLang();
  const router = useRouter();
  const [email, setEmail] = useState(""); const [username, setUsername] = useState(""); const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const submit = async (e: any) => {
    e.preventDefault(); setErr("");
    const r = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, username, password }) });
    const d = await r.json();
    if (!r.ok) return setErr(d.error || "Error");
    router.push("/services"); router.refresh();
  };
  return (
    <div className="min-h-screen"><Nav />
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="card p-8">
          <h1 className="text-2xl font-bold mb-6">{t("register")}</h1>
          <form onSubmit={submit} className="space-y-4">
            <div><label className="label">{t("username")}</label><input className="input" value={username} onChange={e=>setUsername(e.target.value)} required /></div>
            <div><label className="label">{t("email")}</label><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
            <div><label className="label">{t("password")}</label><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} /></div>
            {err && <div className="text-red-400 text-sm">{err}</div>}
            <button className="btn btn-primary w-full justify-center">{t("register")}</button>
          </form>
          <p className="text-center mt-4 text-sm text-muted"><Link href="/login" className="text-accent">{t("login")}</Link></p>
        </div>
      </div>
    </div>
  );
}
