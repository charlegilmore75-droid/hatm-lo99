export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
export async function GET() {
  try { await requireAdmin();
    const users = await db.user.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ users: users.map(u => ({ ...u, password: undefined })) });
  } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
}
