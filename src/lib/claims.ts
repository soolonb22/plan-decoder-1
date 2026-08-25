import { daysUntil } from "./utils";
import type { ClaimItem, ClaimStatus } from "./types";

export const CLAIM_DAYS = 90;

export const POTS: { id: ClaimItem["pot"]; label: string }[] = [
  { id: "core", label: "Core" },
  { id: "capacity", label: "Capacity building" },
  { id: "capital", label: "Capital" },
  { id: "recurring", label: "Recurring" },
];

export const CLAIM_STATUSES: { id: ClaimStatus; label: string }[] = [
  { id: "quote", label: "Quote" },
  { id: "invoice", label: "Invoice to claim" },
  { id: "claimed", label: "Claimed" },
  { id: "paid", label: "Paid / reimbursed" },
];

export function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function claimDue(item: ClaimItem) {
  if (item.status === "quote" || item.status === "paid") return null;
  const due = addDays(item.date, CLAIM_DAYS);
  const left = daysUntil(due);
  return { due, left };
}

export function money(n: number) {
  return n.toLocaleString("en-AU", { style: "currency", currency: "AUD" });
}
