export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
export async function POST() {
  const res = NextResponse.redirect(new URL("/", process.env.NEXTAUTH_URL || "http://localhost:3000"));
  res.cookies.set("token", "", { maxAge: 0, path: "/" });
  return res;
}
