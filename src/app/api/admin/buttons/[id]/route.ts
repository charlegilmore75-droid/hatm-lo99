export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try { await requireAdmin();
    const body = await req.json();
    const data: any = {};
    ["label","url","message"].forEach(k => { if (body[k] !== undefined) data[k] = body[k]; });
    if (typeof body.active === "boolean") data.active = body.active;
    if (typeof body.order === "number") data.order = body.order;
    await db.buttonConfig.update({ where: { id: params.id }, data });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
}
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try { await requireAdmin();
    await db.buttonConfig.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
}
