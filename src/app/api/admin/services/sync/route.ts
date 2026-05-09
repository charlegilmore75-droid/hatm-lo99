export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { provider } from "@/lib/provider";

export async function POST() {
  try {
    await requireAdmin();
    const setting = await db.siteSetting.findUnique({ where: { key: "global_markup" } });
    const globalMarkup = Number(setting?.value || "20");
    const list = await provider.services();
    if (!Array.isArray(list)) return NextResponse.json({ error: "Provider returned invalid data", raw: list }, { status: 502 });
    let count = 0;
    for (const s of list) {
      const id = Number(s.service);
      if (!id) continue;
      const rate = Number(s.rate);
      const min = Number(s.min); const max = Number(s.max);
      const existing = await db.service.findUnique({ where: { id } });
      const markup = existing?.markup ?? globalMarkup;
      const sellRate = rate * (1 + markup / 100);
      await db.service.upsert({
        where: { id },
        update: { name: s.name, type: s.type, category: s.category, rate, min, max, refill: !!s.refill, cancel: !!s.cancel, sellRate },
        create: { id, providerService: id, name: s.name, type: s.type, category: s.category, rate, sellRate, markup, min, max, refill: !!s.refill, cancel: !!s.cancel, description: s.description || null },
      });
      count++;
    }
    return NextResponse.json({ ok: true, count });
  } catch (e: any) { return NextResponse.json({ error: e.message || "Error" }, { status: 500 }); }
}
