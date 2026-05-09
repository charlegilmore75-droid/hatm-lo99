export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
export async function GET() {
  try { await requireAdmin();
    const services = await db.service.findMany({ orderBy: { id: "asc" } });
    return NextResponse.json({ services });
  } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
}
