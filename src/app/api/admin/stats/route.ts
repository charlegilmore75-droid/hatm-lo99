export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
export async function GET() {
  try {
    await requireAdmin();
    const [totalUsers, balAgg, spentAgg, depAgg, profitAgg, active, completed, failed, topServices, topUsers] = await Promise.all([
      db.user.count(),
      db.user.aggregate({ _sum: { balance: true } }),
      db.user.aggregate({ _sum: { totalSpent: true } }),
      db.topUpRequest.aggregate({ _sum: { creditedAmount: true }, where: { status: "APPROVED" } }),
      db.order.aggregate({ _sum: { profit: true } }),
      db.order.count({ where: { status: { in: ["PENDING","IN_PROGRESS","PROCESSING"] } } }),
      db.order.count({ where: { status: "COMPLETED" } }),
      db.order.count({ where: { status: { in: ["FAILED","CANCELED"] } } }),
      db.order.groupBy({ by: ["serviceId"], _count: { _all: true }, orderBy: { _count: { id: "desc" } }, take: 5 }),
      db.user.findMany({ orderBy: { totalSpent: "desc" }, take: 5, select: { username: true, totalSpent: true } }),
    ]);
    const svcIds = topServices.map(t => t.serviceId);
    const svcs = await db.service.findMany({ where: { id: { in: svcIds } } });
    const topServicesNamed = topServices.map(t => ({ name: svcs.find(s => s.id === t.serviceId)?.name || `#${t.serviceId}`, count: t._count._all }));
    return NextResponse.json({
      totalUsers,
      totalBalances: balAgg._sum.balance || 0,
      totalSpent: spentAgg._sum.totalSpent || 0,
      totalDeposits: depAgg._sum.creditedAmount || 0,
      totalProfit: profitAgg._sum.profit || 0,
      activeOrders: active, completedOrders: completed, failedOrders: failed,
      topServices: topServicesNamed, topUsers,
    });
  } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
}
