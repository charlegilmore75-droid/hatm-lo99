export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const data: any = {};
    if (typeof body.balance === "number") data.balance = body.balance;
    if (body.status) data.status = body.status;
    if (body.password) data.password = await bcrypt.hash(body.password, 10);
    await db.user.update({ where: { id: params.id }, data });
    await db.adminActionLog.create({ data: { adminId: admin.id, action: "USER_UPDATE", target: params.id, details: JSON.stringify(body) } });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
}
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin();
    await db.order.deleteMany({ where: { userId: params.id } });
    await db.topUpRequest.deleteMany({ where: { userId: params.id } });
    await db.user.delete({ where: { id: params.id } });
    await db.adminActionLog.create({ data: { adminId: admin.id, action: "USER_DELETE", target: params.id } });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
}
