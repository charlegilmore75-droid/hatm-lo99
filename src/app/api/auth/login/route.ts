export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const u = await db.user.findUnique({ where: { email } });
  if (!u || !(await bcrypt.compare(password, u.password))) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  if (u.status === "BLOCKED") return NextResponse.json({ error: "Account blocked" }, { status: 403 });
  const res = NextResponse.json({ user: { id: u.id, email: u.email, role: u.role } });
  res.cookies.set("token", signToken({ id: u.id, role: u.role }), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60*60*24*30 });
  return res;
}
