export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
export async function GET() {
  try { await requireAdmin();
    const orders = await db.order.findMany({ include: { user: { select: { username: true } }, service: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 500 });
    return NextResponse.json({ orders });
  } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
}
