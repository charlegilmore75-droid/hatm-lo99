import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { db } from "./db";

const SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export function signToken(payload: any) {
  return jwt.sign(payload, SECRET, { expiresIn: "30d" });
}
export function verifyToken(token: string): any {
  try { return jwt.verify(token, SECRET); } catch { return null; }
}
export async function getCurrentUser() {
  const c = cookies().get("token")?.value;
  if (!c) return null;
  const data = verifyToken(c);
  if (!data?.id) return null;
  const user = await db.user.findUnique({ where: { id: data.id } });
  if (!user || user.status === "BLOCKED") return null;
  return user;
}
export async function requireUser() {
  const u = await getCurrentUser();
  if (!u) throw new Error("UNAUTHORIZED");
  return u;
}
export async function requireAdmin() {
  const u = await getCurrentUser();
  if (!u || u.role !== "ADMIN") throw new Error("FORBIDDEN");
  return u;
}
