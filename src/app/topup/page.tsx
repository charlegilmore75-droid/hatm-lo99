"use client";
import Nav from "@/components/Nav";
import StatusBadge from "@/components/StatusBadge";
import { useLang } from "@/lib/lang";
import { useEffect, useState } from "react";

export default function TopupPage() {
  const { t } = useLang();
  const [methods, setMethods] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [m, setM] = useState<any>(null);
  const [amount, setAmount] = useState(""); const [tx, setTx] = useState(""); const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");

  const load = () => {
    fetch("/api/payment-methods").then(r => r.json()).then(d => setMethods(d.methods || []));
    fetch("/api/topup").then(r => r.json()).then(d => setHistory(d.requests || []));
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: any) => {
    e.preventDefault(); setMsg("");
    const r = await fetch("/api/topup", { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ methodCode: m.code, amount: Number(amount), txId: tx, note }) });
    const d = await r.json();
    if (!r.ok) { setMsg(d.error || "Error"); return; }
    setMsg("✅ " + t("waitingReview"));
    setAmount(""); setTx(""); setNote(""); setM(null);
    load();
  };

  return (
    <div className="min-h-screen"><Nav />
      <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-6">{t("topup")}</h1>
          <div className="card p-6">
            <label className="label">{t("selectMethod")}</label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {methods.filter(x => x.active).map(x => (
                <button key={x.id} className={`btn ${m?.id===x.id?"btn-primary":"btn-ghost"} justify-center`} onClick={() => setM(x)}>{x.name}</button>
              ))}
            </div>
            {m && (
              <form onSubmit={submit} className="space-y-3">
                <div className="card p-3 bg-bg">
                  <div className="text-xs text-muted">{t("account")}</div>
                  <div className="font-mono text-accent break-all">{m.account}</div>
                  <div className="text-xs text-muted mt-2">{m.instructions}</div>
                </div>
                <div><label className="label">{t("amount")} ({m.currency})</label><input type="number" step="0.01" className="input" value={amount} onChange={e=>setAmount(e.target.value)} required min={m.minAmount} max={m.maxAmount} /></div>
                <div><label className="label">{t("txId")}</label><input className="input" value={tx} onChange={e=>setTx(e.target.value)} required /></div>
                <div><label className="label">{t("note")}</label><input className="input" value={note} onChange={e=>setNote(e.target.value)} /></div>
                {msg && <div className="text-sm">{msg}</div>}
                <button className="btn btn-primary w-full justify-center">{t("submit")}</button>
              </form>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6">{t("history")}</h2>
          <div className="card overflow-x-auto">
            <table>
              <thead><tr><th>{t("method")}</th><th>{t("amount")}</th><th>{t("status")}</th><th>{t("date")}</th></tr></thead>
              <tbody>{history.map(h => (
                <tr key={h.id}>
                  <td>{h.methodCode}</td>
                  <td>{h.amount}</td>
                  <td><StatusBadge status={h.status} /></td>
                  <td className="text-xs text-muted">{new Date(h.createdAt).toLocaleString()}</td>
                </tr>
              ))}</tbody>
            </table>
            {history.length===0 && <div className="p-6 text-center text-muted">No history</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
