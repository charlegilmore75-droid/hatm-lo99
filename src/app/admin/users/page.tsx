"use client";
import { useEffect, useState } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const load = () => fetch("/api/admin/users").then(r => r.json()).then(d => setUsers(d.users || []));
  useEffect(() => { load(); }, []);
  const act = async (id: string, body: any) => { await fetch(`/api/admin/users/${id}`, { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify(body) }); load(); };
  const del = async (id: string) => { if (!confirm("Delete?")) return; await fetch(`/api/admin/users/${id}`, { method: "DELETE" }); load(); };
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">المستخدمون</h1>
      <div className="card overflow-x-auto">
        <table>
          <thead><tr><th>#</th><th>اسم المستخدم</th><th>البريد</th><th>الرصيد</th><th>الإنفاق</th><th>الحالة</th><th>إجراءات</th></tr></thead>
          <tbody>{users.map(u => (
            <tr key={u.id}>
              <td className="font-mono text-xs">{u.id.slice(-6)}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td className="text-accent">${u.balance.toFixed(2)}</td>
              <td>${u.totalSpent.toFixed(2)}</td>
              <td><span className="badge badge-gray">{u.status}</span></td>
              <td className="space-x-1 space-y-1 rtl:space-x-reverse">
                <button className="btn btn-ghost text-xs" onClick={() => { const v = prompt("New balance", u.balance); if (v!=null) act(u.id, { balance: Number(v) }); }}>💰</button>
                <button className="btn btn-ghost text-xs" onClick={() => { const v = prompt("New password (min 6)"); if (v) act(u.id, { password: v }); }}>🔑</button>
                <button className="btn btn-ghost text-xs" onClick={() => act(u.id, { status: u.status === "FROZEN" ? "ACTIVE" : "FROZEN" })}>❄</button>
                <button className="btn btn-ghost text-xs" onClick={() => act(u.id, { status: u.status === "BLOCKED" ? "ACTIVE" : "BLOCKED" })}>🚫</button>
                <button className="btn btn-danger text-xs" onClick={() => del(u.id)}>🗑</button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
