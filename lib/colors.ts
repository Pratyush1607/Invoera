import type { InvoiceStatus } from "./types";

// Keep these hex values in sync with the CSS custom properties in
// app/globals.css — Tailwind classes can't be used inside inline SVG
// stroke/fill attributes, so components needing raw hex (gauges, donuts,
// bar charts) read DARK/LIGHT directly based on the active theme.
export const DARK = {
  bg: "#0B0B0C",
  card: "#17181A",
  text: "#F2F2F0",
  muted: "#8B8E92",
  border: "#232427",
  inputBg: "#1E1F21",
  accent: "#2FD9A6",
  accentText: "#0B0B0C",
  danger: "#E5636B",
  warning: "#E3A947",
};

export const LIGHT = {
  bg: "#F7F7F5",
  card: "#FFFFFF",
  text: "#141414",
  muted: "#75787C",
  border: "#E7E7E3",
  inputBg: "#F1F1EE",
  accent: "#0EA37A",
  accentText: "#FFFFFF",
  danger: "#D6444C",
  warning: "#E3A947",
};

export const STATUS_HEX: Record<InvoiceStatus, string> = {
  paid: LIGHT.accent,
  pending: LIGHT.warning,
  overdue: LIGHT.danger,
};

export const STATUS_LABEL: Record<InvoiceStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
};

export const CATEGORY_RAMP: string[] = [
  "#0F5B4C",
  "#177862",
  "#1F9678",
  "#2FD9A6",
  "#5FE4BE",
  "#8FEED4",
  "#C0F6E7",
];

// Retained for any lingering call sites during the redesign migration.
export const CATEGORY_HEX: string[] = CATEGORY_RAMP;
