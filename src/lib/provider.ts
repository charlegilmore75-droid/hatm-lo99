import { db } from "./db";

async function cfg() {
  let c = await db.aPIProviderConfig.findUnique({ where: { id: "default" } });
  if (!c) {
    c = await db.aPIProviderConfig.create({
      data: {
        id: "default",
        baseUrl: process.env.PROVIDER_API_URL || "https://boostprovider.com/api/v2",
        apiKey: process.env.PROVIDER_API_KEY || "",
      },
    });
  }
  return c;
}

async function call(params: Record<string, any>) {
  const c = await cfg();
  const body = new URLSearchParams({ key: c.apiKey, ...params } as any);
  const r = await fetch(c.baseUrl, { method: "POST", body, headers: { "Content-Type": "application/x-www-form-urlencoded" } });
  const text = await r.text();
  try { return JSON.parse(text); } catch { return { error: text }; }
}

export const provider = {
  services: () => call({ action: "services" }),
  balance: () => call({ action: "balance" }),
  add: (service: number, link: string, quantity: number) =>
    call({ action: "add", service, link, quantity }),
  status: (order: string | number) => call({ action: "status", order }),
  multiStatus: (orders: string[]) => call({ action: "status", orders: orders.join(",") }),
  refill: (order: string | number) => call({ action: "refill", order }),
  cancel: (orders: string[]) => call({ action: "cancel", orders: orders.join(",") }),
};
