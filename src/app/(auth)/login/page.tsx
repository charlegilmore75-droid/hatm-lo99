"use client";
import Nav from "@/components/Nav";
import { useLang } from "@/lib/lang";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const { t } = useLang();
  const router = useRouter();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const submit = async (e: any) => {
    e.preventDefault(); setErr("");
    const r = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    const d = await r.json();
    if (!r.ok) return setErr(d.error || "Error");
    if (d.user.role === "ADMIN") router.push("/admin"); else router.push("/services");
    router.refresh();
  };
  return (
    <div className="min-h-screen"><Nav />
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="card p-8">
          <h1 className="text-2xl font-bold mb-6">{t("login")}</h1>
          <form onSubmit={submit} className="space-y-4">
            <div><label className="label">{t("email")}</label><input className="input" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
            <div><label className="label">{t("password")}</label><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
            {err && <div className="text-red-400 text-sm">{err}</div>}
            <button className="btn btn-primary w-full justify-center">{t("login")}</button>
          </form>
          <p className="text-center mt-4 text-sm text-muted"><Link href="/register" className="text-accent">{t("register")}</Link></p>
        </div>
      </div>
    </div>
  );
}
