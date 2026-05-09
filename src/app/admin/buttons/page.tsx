"use client";
import { useEffect, useState } from "react";
export default function AdminButtons() {
  const [list, setList] = useState<any[]>([]);
  const [n, setN] = useState({ label:"", url:"", message:"" });
  const load = () => fetch("/api/admin/buttons").then(r => r.json()).then(d => setList(d.buttons || []));
  useEffect(() => { load(); }, []);
  const add = async () => { if (!n.label) return; await fetch("/api/admin/buttons", { method:"POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify(n) }); setN({ label:"", url:"", message:"" }); load(); };
  const upd = async (id: string, body: any) => { await fetch(`/api/admin/buttons/${id}`, { method:"PATCH", headers: { "Content-Type":"application/json" }, body: JSON.stringify(body) }); load(); };
  const del = async (id: string) => { await fetch(`/api/admin/buttons/${id}`, { method:"DELETE" }); load(); };
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">الأزرار المخصصة</h1>
      <div className="card p-4 mb-4 grid md:grid-cols-4 gap-2">
        <input className="input" placeholder="الاسم" value={n.label} onChange={e=>setN({...n,label:e.target.value})} />
        <input className="input" placeholder="الرابط" value={n.url} onChange={e=>setN({...n,url:e.target.value})} />
        <input className="input" placeholder="الرسالة" value={n.message} onChange={e=>setN({...n,message:e.target.value})} />
        <button className="btn btn-primary" onClick={add}>إضافة</button>
      </div>
      <div className="space-y-2">{list.map(b => (
        <div key={b.id} className="card p-3 flex flex-wrap items-center gap-2">
          <input className="input flex-1 min-w-[120px]" defaultValue={b.label} onBlur={e=>upd(b.id, { label:e.target.value })} />
          <input className="input flex-1 min-w-[150px]" defaultValue={b.url} onBlur={e=>upd(b.id, { url:e.target.value })} />
          <input className="input flex-1 min-w-[150px]" defaultValue={b.message||""} onBlur={e=>upd(b.id, { message:e.target.value })} />
          <label className="text-xs flex items-center gap-1"><input type="checkbox" checked={b.active} onChange={e=>upd(b.id, { active:e.target.checked })} /> نشط</label>
          <button className="btn btn-danger text-xs" onClick={()=>del(b.id)}>🗑</button>
        </div>
      ))}</div>
    </div>
  );
}
