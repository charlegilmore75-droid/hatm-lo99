export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export async function GET() {
  const buttons = await db.buttonConfig.findMany({ where: { active: true }, orderBy: { order: "asc" } });
  const banner = await db.siteSetting.findUnique({ where: { key: "banner" } });
  return NextResponse.json({ buttons, banner: banner?.value || "" });
}
