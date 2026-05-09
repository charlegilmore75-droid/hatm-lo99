export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET() {
  try {
    const u = await requireUser();
    const requests = await db.topUpRequest.findMany({ where: { userId: u.id }, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ requests });
  } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
}

const Schema = z.object({ methodCode: z.string().min(1).max(50), amount: z.number().positive(), txId: z.string().min(1).max(200), note: z.string().max(500).optional() });

export async function POST(req: Request) {
  try {
    const u = await requireUser();
    const p = Schema.safeParse(await req.json());
    if (!p.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
    const m = await db.paymentMethod.findUnique({ where: { code: p.data.methodCode } });
    if (!m || !m.active) return NextResponse.json({ error: "Method unavailable" }, { status: 400 });
    if (p.data.amount < m.minAmount || p.data.amount > m.maxAmount) return NextResponse.json({ error: "Amount out of range" }, { status: 400 });
    const r = await db.topUpRequest.create({ data: { userId: u.id, methodCode: p.data.methodCode, amount: p.data.amount, txId: p.data.txId, note: p.data.note } });
    return NextResponse.json({ request: r });
  } catch { return NextResponse.json({ error: "Error" }, { status: 500 }); }
}
