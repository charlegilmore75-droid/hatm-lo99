export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { provider } from "@/lib/provider";
import { z } from "zod";

export async function GET() {
  try {
    const u = await requireUser();
    const orders = await db.order.findMany({ where: { userId: u.id }, include: { service: true }, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ orders });
  } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
}

const Schema = z.object({ serviceId: z.number().int(), link: z.string().url().max(500), quantity: z.number().int().positive() });

export async function POST(req: Request) {
  try {
    const u = await requireUser();
    if (u.status !== "ACTIVE") return NextResponse.json({ error: "Account not active" }, { status: 403 });
    const body = await req.json();
    const p = Schema.safeParse(body);
    if (!p.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    const svc = await db.service.findUnique({ where: { id: p.data.serviceId } });
    if (!svc || !svc.active || svc.hidden) return NextResponse.json({ error: "Service unavailable" }, { status: 404 });
    if (p.data.quantity < svc.min || p.data.quantity > svc.max) return NextResponse.json({ error: "Quantity out of range" }, { status: 400 });
    const charge = (svc.sellRate * p.data.quantity) / 1000;
    const cost = (svc.rate * p.data.quantity) / 1000;
    if (u.balance < charge) return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });

    // place at provider
    const r = await provider.add(svc.providerService, p.data.link, p.data.quantity);
    if (!r || r.error || !r.order) {
      return NextResponse.json({ error: r?.error || "Provider failed" }, { status: 502 });
    }

    const order = await db.$transaction(async (tx) => {
      const o = await tx.order.create({ data: {
        userId: u.id, serviceId: svc.id, providerOrderId: String(r.order),
        link: p.data.link, quantity: p.data.quantity, charge, cost, profit: charge - cost, status: "PENDING",
      }});
      await tx.user.update({ where: { id: u.id }, data: { balance: { decrement: charge }, totalSpent: { increment: charge } } });
      return o;
    });
    return NextResponse.json({ order });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error" }, { status: 500 });
  }
}
