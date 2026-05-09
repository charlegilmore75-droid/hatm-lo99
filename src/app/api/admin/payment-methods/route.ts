export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
export async function GET() {
  try { await requireAdmin();
    return NextResponse.json({ methods: await db.paymentMethod.findMany() });
  } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
}
