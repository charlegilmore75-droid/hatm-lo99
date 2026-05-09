"use client";
import { useLang } from "@/lib/lang";
const map: Record<string, string> = {
  PENDING: "badge-yellow", IN_PROGRESS: "badge-blue", PROCESSING: "badge-blue",
  COMPLETED: "badge-green", PARTIAL: "badge-yellow", CANCELED: "badge-gray",
  REFUNDED: "badge-gray", FAILED: "badge-red", APPROVED: "badge-green", REJECTED: "badge-red",
};
const labels: Record<string, keyof import("@/lib/i18n").Dict> = {
  PENDING: "pending", IN_PROGRESS: "inProgress", PROCESSING: "inProgress",
  COMPLETED: "completed", PARTIAL: "partial", CANCELED: "canceled",
  REFUNDED: "refunded", FAILED: "failed", APPROVED: "approved", REJECTED: "rejected",
};
export default function StatusBadge({ status }: { status: string }) {
  const { t } = useLang();
  const k = labels[status] || "pending";
  return <span className={`badge ${map[status] || "badge-gray"}`}>{t(k)}</span>;
}
