export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  if (!key || key !== process.env.JWT_SECRET) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const email = process.env.ADMIN_EMAIL || "admin@hatm.com";
  const pwd = process.env.ADMIN_PASSWORD || "Admin@12345";
  await db.user.upsert({
    where: { email }, update: {},
    create: { email, username: "admin", password: await bcrypt.hash(pwd, 10), role: "ADMIN" },
  });
  await db.aPIProviderConfig.upsert({
    where: { id: "default" }, update: {},
    create: { id: "default", baseUrl: process.env.PROVIDER_API_URL || "https://boostprovider.com/api/v2", apiKey: process.env.PROVIDER_API_KEY || "" },
  });
  const methods = [
    { code: "USDT_BEP20", name: "USDT (BEP20)", account: "0x000...", instructions: "USDT BEP20", currency: "USDT", rate: 1 },
    { code: "USDT_TRC20", name: "USDT (TRC20)", account: "T...", instructions: "USDT TRC20", currency: "USDT", rate: 1 },
    { code: "CASH_SHAM", name: "كاش الشام", account: "09xxxxxxxx", instructions: "كاش الشام", currency: "SYP", rate: 0.0001 },
    { code: "SYP", name: "ليرة سورية", account: "09xxxxxxxx", instructions: "SYP", currency: "SYP", rate: 0.0001 },
    { code: "USD", name: "دولار أمريكي", account: "USD", instructions: "USD", currency: "USD", rate: 1 },
    { code: "SYRIATEL_CASH", name: "سيرياتيل كاش", account: "09xxxxxxxx", instructions: "Syriatel Cash", currency: "SYP", rate: 0.0001 },
  ];
  for (const m of methods) await db.paymentMethod.upsert({ where: { code: m.code }, update: {}, create: m });
  for (const s of [{ key: "site_name", value: "HATM" }, { key: "global_markup", value: "20" }, { key: "banner", value: "مرحباً بك في منصة HATM" }]) {
    await db.siteSetting.upsert({ where: { key: s.key }, update: {}, create: s });
  }
  return NextResponse.json({ ok: true, admin: email });
}
