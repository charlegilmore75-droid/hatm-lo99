export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
export async function GET() {
  try { await requireAdmin();
    const requests = await db.topUpRequest.findMany({ include: { user: { select: { username: true } } }, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ requests });
  } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
}
