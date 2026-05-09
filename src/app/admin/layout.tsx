import Nav from "@/components/Nav";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const u = await getCurrentUser();
  if (!u || u.role !== "ADMIN") redirect("/login");
  return (
    <div className="min-h-screen"><Nav />
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6 flex-col md:flex-row">
        <aside className="md:w-56 shrink-0">
          <div className="card p-3 space-y-1 sticky top-20">
            <Link href="/admin" className="block px-3 py-2 rounded hover:bg-bg">📊 لوحة</Link>
            <Link href="/admin/users" className="block px-3 py-2 rounded hover:bg-bg">👥 المستخدمون</Link>
            <Link href="/admin/services" className="block px-3 py-2 rounded hover:bg-bg">🧰 الخدمات</Link>
            <Link href="/admin/orders" className="block px-3 py-2 rounded hover:bg-bg">📦 الطلبات</Link>
            <Link href="/admin/topups" className="block px-3 py-2 rounded hover:bg-bg">💰 طلبات الشحن</Link>
            <Link href="/admin/payment-methods" className="block px-3 py-2 rounded hover:bg-bg">💳 طرق الدفع</Link>
            <Link href="/admin/settings" className="block px-3 py-2 rounded hover:bg-bg">⚙️ الإعدادات</Link>
            <Link href="/admin/buttons" className="block px-3 py-2 rounded hover:bg-bg">🔘 الأزرار</Link>
          </div>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
