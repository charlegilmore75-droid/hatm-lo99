"use client";
import StatusBadge from "@/components/StatusBadge";
import { useEffect, useState } from "react";
export default function AdminTopups() {
  const [list, setList] = useState<any[]>([]);
  const load = () => fetch("/api/admin/topups").then(r => r.json()).then(d => setList(d.requests || []));
  useEffect(() => { load(); }, []);
  const act = async (id: string, action: string, creditedAmount?: number) => {
    await fetch(`/api/admin/topups/${id}`, { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ action, creditedAmount }) });
    load();
  };
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">طلبات الشحن</h1>
      <div className="card overflow-x-auto"><table>
        <thead><tr><th>#</th><th>المستخدم</th><th>الطريقة</th><th>المبلغ</th><th>عملية</th><th>ملاحظة</th><th>الحالة</th><th>إجراءات</th></tr></thead>
        <tbody>{list.map(r => (
          <tr key={r.id}>
            <td className="font-mono text-xs">{r.id.slice(-6)}</td>
            <td>{r.user?.username}</td>
            <td>{r.methodCode}</td>
            <td>{r.amount}</td>
            <td className="font-mono text-xs">{r.txId}</td>
            <td className="text-xs">{r.note}</td>
            <td><StatusBadge status={r.status} /></td>
            <td>{r.status === "PENDING" && (
              <div className="flex gap-1">
                <button className="btn btn-primary text-xs" onClick={() => { const v = prompt("المبلغ المضاف بالدولار", String(r.amount)); if (v) act(r.id, "approve", Number(v)); }}>قبول</button>
                <button className="btn btn-danger text-xs" onClick={() => act(r.id, "reject")}>رفض</button>
              </div>
            )}</td>
          </tr>
        ))}</tbody>
      </table></div>
    </div>
  );
}
