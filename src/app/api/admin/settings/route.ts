export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
export async function GET() {
  try { await requireAdmin();
    const api = await db.aPIProviderConfig.findUnique({ where: { id: "default" } });
    const allSettings = await db.siteSetting.findMany();
    const settings = Object.fromEntries(allSettings.map(s => [s.key, s.value]));
    return NextResponse.json({ api, settings });
  } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
}
export async function POST(req: Request) {
  try { await requireAdmin();
    const { api, settings } = await req.json();
    if (api) {
      await db.aPIProviderConfig.upsert({ where: { id: "default" }, update: { baseUrl: api.baseUrl, apiKey: api.apiKey }, create: { id: "default", baseUrl: api.baseUrl, apiKey: api.apiKey } });
    }
    if (settings) {
      for (const [k, v] of Object.entries(settings)) {
        await db.siteSetting.upsert({ where: { key: k }, update: { value: String(v) }, create: { key: k, value: String(v) } });
      }
    }
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
}
