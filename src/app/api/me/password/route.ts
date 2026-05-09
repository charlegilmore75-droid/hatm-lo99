export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
export async function POST(req: Request) {
  try {
    const u = await requireUser();
    const { password } = await req.json();
    if (!password || password.length < 6) return NextResponse.json({ error: "Invalid" }, { status: 400 });
    await db.user.update({ where: { id: u.id }, data: { password: await bcrypt.hash(password, 10) } });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
}
