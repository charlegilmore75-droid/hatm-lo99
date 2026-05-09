"use client";
import { useEffect, useState } from "react";

export default function AdminHome() {
  const [s, setS] = useState<any>(null);
  useEffect(() => { fetch("/api/admin/stats").then(r => r.json()).then(setS); }, []);
  if (!s) return <div>...</div>;
  const cards = [
    { label: "إجمالي المستخدمين", val: s.totalUsers },
    { label: "إجمالي الأرصدة", val: `$${s.totalBalances.toFixed(2)}` },
    { label: "إجمالي الإنفاق", val: `$${s.totalSpent.toFixed(2)}` },
    { label: "إجمالي الإيداعات", val: `$${s.totalDeposits.toFixed(2)}` },
    { label: "الأرباح", val: `$${s.totalProfit.toFixed(2)}` },
    { label: "طلبات نشطة", val: s.activeOrders },
    { label: "طلبات مكتملة", val: s.completedOrders },
    { label: "طلبات فاشلة", val: s.failedOrders },
  ];
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">لوحة التحكم</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <div key={i} className="card p-5">
            <div className="text-sm text-muted">{c.label}</div>
            <div className="text-2xl font-bold text-accent mt-2">{c.val}</div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="card p-5">
          <h2 className="font-bold mb-3">أعلى الخدمات مبيعاً</h2>
          <ul className="space-y-2">{s.topServices.map((x: any, i: number) => (
            <li key={i} className="flex justify-between text-sm"><span>{x.name}</span><span className="text-accent">{x.count}</span></li>
          ))}</ul>
        </div>
        <div className="card p-5">
          <h2 className="font-bold mb-3">أكثر المستخدمين إنفاقاً</h2>
          <ul className="space-y-2">{s.topUsers.map((x: any, i: number) => (
            <li key={i} className="flex justify-between text-sm"><span>{x.username}</span><span className="text-accent">${x.totalSpent.toFixed(2)}</span></li>
          ))}</ul>
        </div>
      </div>
    </div>
  );
}
