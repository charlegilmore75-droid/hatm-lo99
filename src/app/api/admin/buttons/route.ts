export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
export async function GET() {
  try { await requireAdmin();
    return NextResponse.json({ buttons: await db.buttonConfig.findMany({ orderBy: { order: "asc" } }) });
  } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
}
export async function POST(req: Request) {
  try { await requireAdmin();
    const body = await req.json();
    const b = await db.buttonConfig.create({ data: { label: body.label, url: body.url, message: body.message } });
    return NextResponse.json({ button: b });
  } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
}
