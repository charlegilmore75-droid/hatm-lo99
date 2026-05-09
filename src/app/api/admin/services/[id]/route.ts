export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try { await requireAdmin();
    const body = await req.json();
    const id = Number(params.id);
    const svc = await db.service.findUnique({ where: { id } });
    if (!svc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const data: any = {};
    if (typeof body.markup === "number") { data.markup = body.markup; data.sellRate = svc.rate * (1 + body.markup / 100); }
    if (typeof body.active === "boolean") data.active = body.active;
    if (typeof body.hidden === "boolean") data.hidden = body.hidden;
    if (typeof body.sellRate === "number") data.sellRate = body.sellRate;
    if (body.name) data.name = body.name;
    await db.service.update({ where: { id }, data });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
}
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try { await requireAdmin();
    await db.service.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
}
