export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export async function GET() {
  const services = await db.service.findMany({ where: { active: true, hidden: false }, orderBy: { id: "asc" } });
  return NextResponse.json({ services });
}
