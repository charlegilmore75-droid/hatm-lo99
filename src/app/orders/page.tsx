"use client";
import Nav from "@/components/Nav";
import StatusBadge from "@/components/StatusBadge";
import { useLang } from "@/lib/lang";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const { t } = useLang();
  const [orders, setOrders] = useState<any[]>([]);
  const load = () => fetch("/api/orders").then(r => r.json()).then(d => setOrders(d.orders || []));
  useEffect(() => { load(); }, []);
  const sync = async () => { await fetch("/api/orders/sync", { method: "POST" }); load(); };
  const refill = async (id: string) => { await fetch(`/api/orders/${id}/refill`, { method: "POST" }); load(); };
  return (
    <div className="min-h-screen"><Nav />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">{t("orders")}</h1>
          <button className="btn btn-ghost" onClick={sync}>↻ {t("syncOrders")}</button>
        </div>
        <div className="card overflow-x-auto">
          <table>
            <thead><tr><th>#</th><th>{t("services")}</th><th>{t("link")}</th><th>{t("quantity")}</th><th>{t("price")}</th><th>{t("status")}</th><th>{t("date")}</th><th></th></tr></thead>
            <tbody>{orders.map(o => (
              <tr key={o.id}>
                <td className="font-mono text-xs">{o.id.slice(-6)}</td>
                <td>{o.service?.name}</td>
                <td className="max-w-[200px] truncate"><a href={o.link} target="_blank" rel="noreferrer" className="text-accent">{o.link}</a></td>
                <td>{o.quantity}</td>
                <td className="text-accent">${o.charge.toFixed(4)}</td>
                <td><StatusBadge status={o.status} /></td>
                <td className="text-xs text-muted">{new Date(o.createdAt).toLocaleString()}</td>
                <td>{o.service?.refill && (o.status === "COMPLETED" || o.status === "PARTIAL") && <button className="btn btn-ghost text-xs" onClick={() => refill(o.id)}>{t("refill")}</button>}</td>
              </tr>
            ))}</tbody>
          </table>
          {orders.length === 0 && <div className="p-8 text-center text-muted">No orders</div>}
        </div>
      </div>
    </div>
  );
}
