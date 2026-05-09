"use client";
import StatusBadge from "@/components/StatusBadge";
import { useEffect, useState } from "react";
export default function AdminOrders() {
  const [orders, setO] = useState<any[]>([]);
  const load = () => fetch("/api/admin/orders").then(r => r.json()).then(d => setO(d.orders || []));
  useEffect(() => { load(); }, []);
  return (
    <div>
      <div className="flex justify-between mb-6"><h1 className="text-3xl font-bold">الطلبات</h1>
        <button className="btn btn-ghost" onClick={async () => { await fetch("/api/orders/sync", {method:"POST"}); load(); }}>↻ مزامنة</button></div>
      <div className="card overflow-x-auto"><table>
        <thead><tr><th>#</th><th>المستخدم</th><th>الخدمة</th><th>الكمية</th><th>التكلفة</th><th>السعر</th><th>الربح</th><th>الحالة</th><th>التاريخ</th></tr></thead>
        <tbody>{orders.map(o => (
          <tr key={o.id}>
            <td className="font-mono text-xs">{o.id.slice(-6)}</td>
            <td>{o.user?.username}</td>
            <td className="max-w-[200px] truncate">{o.service?.name}</td>
            <td>{o.quantity}</td>
            <td>${o.cost.toFixed(4)}</td>
            <td>${o.charge.toFixed(4)}</td>
            <td className="text-accent">${o.profit.toFixed(4)}</td>
            <td><StatusBadge status={o.status} /></td>
            <td className="text-xs text-muted">{new Date(o.createdAt).toLocaleString()}</td>
          </tr>
        ))}</tbody>
      </table></div>
    </div>
  );
}
