import type { InvoiceStatus } from "./types";

export const STATUS_HEX: Record<InvoiceStatus, string> = {
  paid: "#0d9488",
  pending: "#f59e0b",
  overdue: "#ef4444",
};

export const STATUS_LABEL: Record<InvoiceStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
};

export const CATEGORY_HEX: string[] = [
  "#0d9488",
  "#f59e0b",
  "#8b5cf6",
  "#0ea5e9",
  "#ef4444",
  "#84cc16",
  "#ec4899",
  "#6366f1",
];
