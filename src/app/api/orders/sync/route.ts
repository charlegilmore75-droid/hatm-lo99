export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { provider } from "@/lib/provider";

const map: Record<string, any> = {
  "Pending": "PENDING", "In progress": "IN_PROGRESS", "Processing": "PROCESSING",
  "Completed": "COMPLETED", "Partial": "PARTIAL", "Canceled": "CANCELED", "Cancelled": "CANCELED",
  "Refunded": "REFUNDED",
};

export async function POST() {
  try {
    const u = await requireUser();
    const where: any = u.role === "ADMIN" ? {} : { userId: u.id };
    const orders = await db.order.findMany({ where: { ...where, providerOrderId: { not: null }, status: { in: ["PENDING","IN_PROGRESS","PROCESSING","PARTIAL"] as any } }, take: 100 });
    for (const o of orders) {
      const r = await provider.status(o.providerOrderId!);
      if (r && !r.error && r.status) {
        const newStatus = map[r.status] || o.status;
        await db.order.update({ where: { id: o.id }, data: {
          status: newStatus,
          startCount: r.start_count ? Number(r.start_count) : o.startCount,
          remains: r.remains != null ? Number(r.remains) : o.remains,
        }});
        // refund partial unused or cancel
        if ((newStatus === "CANCELED" || newStatus === "REFUNDED") && o.status !== newStatus) {
          await db.user.update({ where: { id: o.userId }, data: { balance: { increment: o.charge }, totalSpent: { decrement: o.charge } } });
        }
      }
    }
    return NextResponse.json({ ok: true, count: orders.length });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
