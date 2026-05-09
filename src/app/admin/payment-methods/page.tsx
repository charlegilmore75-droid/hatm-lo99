"use client";
import { useEffect, useState } from "react";
export default function AdminMethods() {
  const [list, setList] = useState<any[]>([]);
  const load = () => fetch("/api/admin/payment-methods").then(r => r.json()).then(d => setList(d.methods || []));
  useEffect(() => { load(); }, []);
  const upd = async (id: string, body: any) => { await fetch(`/api/admin/payment-methods/${id}`, { method:"PATCH", headers: { "Content-Type":"application/json" }, body: JSON.stringify(body) }); load(); };
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">طرق الدفع</h1>
      <div className="space-y-3">{list.map(m => (
        <div key={m.id} className="card p-4 grid md:grid-cols-6 gap-3">
          <div><div className="text-xs text-muted">الكود</div><div className="font-bold">{m.code}</div><div className="text-xs">{m.name}</div></div>
          <div className="md:col-span-2"><label className="label">الحساب</label><input className="input" defaultValue={m.account} onBlur={e => upd(m.id, { account: e.target.value })} /></div>
          <div className="md:col-span-2"><label className="label">التعليمات</label><input className="input" defaultValue={m.instructions} onBlur={e => upd(m.id, { instructions: e.target.value })} /></div>
          <div><label className="label">سعر التحويل (للدولار)</label><input type="number" step="0.000001" className="input" defaultValue={m.rate} onBlur={e => upd(m.id, { rate: Number(e.target.value) })} /></div>
          <div><label className="label">حد أدنى</label><input type="number" className="input" defaultValue={m.minAmount} onBlur={e => upd(m.id, { minAmount: Number(e.target.value) })} /></div>
          <div><label className="label">حد أعلى</label><input type="number" className="input" defaultValue={m.maxAmount} onBlur={e => upd(m.id, { maxAmount: Number(e.target.value) })} /></div>
          <div><label className="label">العملة</label><input className="input" defaultValue={m.currency} onBlur={e => upd(m.id, { currency: e.target.value })} /></div>
          <div><label className="label">نشط</label><input type="checkbox" checked={m.active} onChange={e => upd(m.id, { active: e.target.checked })} /></div>
        </div>
      ))}</div>
    </div>
  );
}
