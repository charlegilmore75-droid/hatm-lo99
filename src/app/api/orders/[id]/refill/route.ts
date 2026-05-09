export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { provider } from "@/lib/provider";
export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const u = await requireUser();
    const o = await db.order.findUnique({ where: { id: params.id } });
    if (!o || o.userId !== u.id) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (!o.providerOrderId) return NextResponse.json({ error: "No provider id" }, { status: 400 });
    const r = await provider.refill(o.providerOrderId);
    if (r?.refill) { await db.order.update({ where: { id: o.id }, data: { refillId: String(r.refill) } }); }
    return NextResponse.json({ ok: true, result: r });
  } catch { return NextResponse.json({ error: "Error" }, { status: 500 }); }
}
