import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const db = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@hatm.com";
  const pwd = process.env.ADMIN_PASSWORD || "Admin@12345";
  const hash = await bcrypt.hash(pwd, 10);
  await db.user.upsert({
    where: { email },
    update: {},
    create: { email, username: "admin", password: hash, role: "ADMIN", balance: 0 },
  });
  await db.aPIProviderConfig.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      baseUrl: process.env.PROVIDER_API_URL || "https://boostprovider.com/api/v2",
      apiKey: process.env.PROVIDER_API_KEY || "",
    },
  });
  const methods = [
    { code: "USDT_BEP20", name: "USDT (BEP20)", account: "0x0000000000000000000000000000000000000000", instructions: "أرسل USDT عبر شبكة BEP20 إلى العنوان المرفق", currency: "USDT", rate: 1 },
    { code: "USDT_TRC20", name: "USDT (TRC20)", account: "TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", instructions: "أرسل USDT عبر شبكة TRC20 فقط", currency: "USDT", rate: 1 },
    { code: "CASH_SHAM", name: "كاش الشام", account: "09xxxxxxxx", instructions: "حوّل المبلغ عبر كاش الشام", currency: "SYP", rate: 0.0001 },
    { code: "SYP", name: "ليرة سورية", account: "09xxxxxxxx", instructions: "تحويل ليرة سورية", currency: "SYP", rate: 0.0001 },
    { code: "USD", name: "دولار أمريكي", account: "حوالة دولار", instructions: "حوالة بالدولار", currency: "USD", rate: 1 },
    { code: "SYRIATEL_CASH", name: "سيرياتيل كاش", account: "09xxxxxxxx", instructions: "حوّل عبر سيرياتيل كاش", currency: "SYP", rate: 0.0001 },
  ];
  for (const m of methods) {
    await db.paymentMethod.upsert({ where: { code: m.code }, update: {}, create: m });
  }
  const settings = [
    { key: "site_name", value: "HATM" },
    { key: "global_markup", value: "20" },
    { key: "banner", value: "مرحباً بك في منصة HATM لخدمات التواصل الاجتماعي" },
  ];
  for (const s of settings) {
    await db.siteSetting.upsert({ where: { key: s.key }, update: {}, create: s });
  }
  console.log("Seed OK. Admin:", email);
}
main().finally(() => db.$disconnect());
