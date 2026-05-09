export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { z } from "zod";

const Schema = z.object({ email: z.string().email(), username: z.string().min(3).max(30), password: z.string().min(6).max(100) });

export async function POST(req: Request) {
  const body = await req.json();
  const p = Schema.safeParse(body);
  if (!p.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const exists = await db.user.findFirst({ where: { OR: [{ email: p.data.email }, { username: p.data.username }] } });
  if (exists) return NextResponse.json({ error: "Email or username exists" }, { status: 400 });
  const user = await db.user.create({ data: { email: p.data.email, username: p.data.username, password: await bcrypt.hash(p.data.password, 10) } });
  const res = NextResponse.json({ user: { id: user.id, email: user.email, role: user.role } });
  res.cookies.set("token", signToken({ id: user.id, role: user.role }), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60*60*24*30 });
  return res;
}
