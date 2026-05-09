"use client";
import Nav from "@/components/Nav";
import { useLang } from "@/lib/lang";
import { useEffect, useState } from "react";

export default function ServicesPage() {
  const { t } = useLang();
  const [services, setServices] = useState<any[]>([]);
  const [q, setQ] = useState(""); const [cat, setCat] = useState("");
  const [me, setMe] = useState<any>(null);
  const [order, setOrder] = useState<{svc: any, link: string, qty: number} | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/services").then(r => r.json()).then(d => setServices(d.services || []));
    fetch("/api/me").then(r => r.json()).then(d => setMe(d.user));
  }, []);

  const cats = Array.from(new Set(services.map(s => s.category).filter(Boolean)));
  const filtered = services.filter(s => (!q || s.name.toLowerCase().includes(q.toLowerCase())) && (!cat || s.category === cat));

  const placeOrder = async () => {
    if (!order) return;
    setMsg("");
    const r = await fetch("/api/orders", { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ serviceId: order.svc.id, link: order.link, quantity: order.qty }) });
    const d = await r.json();
    if (!r.ok) { setMsg(d.error || "Error"); return; }
    setMsg("✅ تم إنشاء الطلب");
    setOrder(null);
    fetch("/api/me").then(r => r.json()).then(d => setMe(d.user));
  };

  return (
    <div className="min-h-screen"><Nav />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t("services")}</h1>
        <div className="flex gap-2 mb-4 flex-wrap">
          <input className="input flex-1 min-w-[200px]" placeholder={t("services")} value={q} onChange={e => setQ(e.target.value)} />
          <select className="input max-w-xs" value={cat} onChange={e => setCat(e.target.value)}>
            <option value="">All</option>
            {cats.map(c => <option key={c} value={c as string}>{c as string}</option>)}
          </select>
        </div>
        <div className="card overflow-x-auto">
          <table>
            <thead><tr>
              <th>{t("serviceId")}</th><th>{t("services")}</th><th>{t("price")}/1k</th>
              <th>{t("min")}</th><th>{t("max")}</th><th>{t("refill")}</th><th>{t("actions")}</th>
            </tr></thead>
            <tbody>{filtered.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td><div className="font-semibold">{s.name}</div><div className="text-xs text-muted">{s.category}</div></td>
                <td className="text-accent font-bold">${s.sellRate.toFixed(4)}</td>
                <td>{s.min}</td><td>{s.max}</td>
                <td>{s.refill ? "✓" : "—"}</td>
                <td><button className="btn btn-primary text-xs" onClick={() => setOrder({ svc: s, link: "", qty: s.min })} disabled={!me}>{t("newOrder")}</button></td>
              </tr>
            ))}</tbody>
          </table>
          {filtered.length === 0 && <div className="p-8 text-center text-muted">No services</div>}
        </div>
      </div>

      {order && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setOrder(null)}>
          <div className="card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-1">{order.svc.name}</h2>
            <p className="text-xs text-muted mb-4">{order.svc.description}</p>
            {order.svc.warning && <div className="badge badge-yellow mb-3">⚠ {order.svc.warning}</div>}
            <div className="space-y-3">
              <div><label className="label">{t("link")}</label><input className="input" value={order.link} onChange={e => setOrder({...order, link: e.target.value})} /></div>
              <div><label className="label">{t("quantity")} ({order.svc.min} - {order.svc.max})</label>
                <input type="number" className="input" value={order.qty} min={order.svc.min} max={order.svc.max} onChange={e => setOrder({...order, qty: Number(e.target.value)})} /></div>
              <div className="flex justify-between text-sm"><span>{t("price")}:</span><span className="text-accent font-bold">${(order.svc.sellRate * order.qty / 1000).toFixed(4)}</span></div>
              {msg && <div className="text-sm">{msg}</div>}
              <div className="flex gap-2">
                <button className="btn btn-primary flex-1 justify-center" onClick={placeOrder}>{t("confirm")}</button>
                <button className="btn btn-ghost" onClick={() => setOrder(null)}>{t("cancel")}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
