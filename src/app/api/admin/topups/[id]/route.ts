export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const r = await db.topUpRequest.findUnique({ where: { id: params.id } });
    if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (r.status !== "PENDING") return NextResponse.json({ error: "Already processed" }, { status: 400 });
    if (body.action === "approve") {
      const credited = Number(body.creditedAmount || r.amount);
      await db.$transaction([
        db.topUpRequest.update({ where: { id: r.id }, data: { status: "APPROVED", creditedAmount: credited, reviewedAt: new Date() } }),
        db.user.update({ where: { id: r.userId }, data: { balance: { increment: credited } } }),
      ]);
    } else {
      await db.topUpRequest.update({ where: { id: r.id }, data: { status: "REJECTED", reviewedAt: new Date(), adminNote: body.note } });
    }
    await db.adminActionLog.create({ data: { adminId: admin.id, action: `TOPUP_${body.action}`, target: r.id } });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
}
