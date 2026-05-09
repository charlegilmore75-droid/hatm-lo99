export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try { await requireAdmin();
    const body = await req.json();
    const data: any = {};
    ["account","instructions","currency","name"].forEach(k => { if (body[k] !== undefined) data[k] = body[k]; });
    ["rate","minAmount","maxAmount"].forEach(k => { if (body[k] !== undefined) data[k] = Number(body[k]); });
    if (typeof body.active === "boolean") data.active = body.active;
    await db.paymentMethod.update({ where: { id: params.id }, data });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
}
