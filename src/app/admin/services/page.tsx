"use client";
import { useEffect, useState } from "react";

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");
  const load = () => fetch("/api/admin/services").then(r => r.json()).then(d => setServices(d.services || []));
  useEffect(() => { load(); }, []);
  const sync = async () => { setBusy(true); await fetch("/api/admin/services/sync", { method: "POST" }); setBusy(false); load(); };
  const upd = async (id: number, body: any) => { await fetch(`/api/admin/services/${id}`, { method: "PATCH", headers: { "Content-Type":"application/json" }, body: JSON.stringify(body) }); load(); };
  const del = async (id: number) => { if (!confirm("Delete?")) return; await fetch(`/api/admin/services/${id}`, { method: "DELETE" }); load(); };
  const filtered = services.filter(s => !q || s.name.toLowerCase().includes(q.toLowerCase()) || String(s.id).includes(q));
  return (
    <div>
      <div className="flex justify-between mb-6 flex-wrap gap-2">
        <h1 className="text-3xl font-bold">الخدمات</h1>
        <button className="btn btn-primary" disabled={busy} onClick={sync}>{busy ? "..." : "↻ مزامنة من المزود"}</button>
      </div>
      <input className="input mb-4" placeholder="بحث..." value={q} onChange={e => setQ(e.target.value)} />
      <div className="card overflow-x-auto">
        <table>
          <thead><tr><th>#</th><th>الاسم</th><th>الفئة</th><th>التكلفة</th><th>السعر</th><th>الربح %</th><th>نشط</th><th>مخفي</th><th>إجراءات</th></tr></thead>
          <tbody>{filtered.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td className="max-w-[300px]">{s.name}</td>
              <td className="text-xs">{s.category}</td>
              <td>${s.rate.toFixed(4)}</td>
              <td className="text-accent">${s.sellRate.toFixed(4)}</td>
              <td><input type="number" defaultValue={s.markup} className="input w-20 text-xs" onBlur={e => upd(s.id, { markup: Number(e.target.value) })} /></td>
              <td><input type="checkbox" checked={s.active} onChange={e => upd(s.id, { active: e.target.checked })} /></td>
              <td><input type="checkbox" checked={s.hidden} onChange={e => upd(s.id, { hidden: e.target.checked })} /></td>
              <td><button className="btn btn-danger text-xs" onClick={() => del(s.id)}>🗑</button></td>
            </tr>
          ))}</tbody>
        </table>
        {filtered.length===0 && <div className="p-6 text-center text-muted">No services. اضغط مزامنة.</div>}
      </div>
    </div>
  );
}
