export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
export async function GET() {
  const u = await getCurrentUser();
  if (!u) return NextResponse.json({ user: null });
  return NextResponse.json({ user: { id: u.id, email: u.email, username: u.username, role: u.role, balance: u.balance, totalSpent: u.totalSpent } });
}
