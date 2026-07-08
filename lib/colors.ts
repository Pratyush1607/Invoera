import type { InvoiceStatus } from "./types";

// Keep these hex values in sync with the CSS custom properties in
// app/globals.css — Tailwind classes can't be used inside inline SVG
// stroke/fill attributes, so components needing raw hex (gauges, donuts,
// bar charts) read DARK/LIGHT directly based on the active theme.
export const DARK = {
  bg: "#0A0A0E",
  card: "#141319",
  text: "#F5F4F7",
  muted: "#8D8B96",
  border: "#232230",
  inputBg: "#1A1922",
  accent: "#8B7CF6",
  accentText: "#FFFFFF",
  danger: "#F0636B",
  warning: "#E3A947",
};

export const LIGHT = {
  bg: "#F7F6FB",
  card: "#FFFFFF",
  text: "#17161D",
  muted: "#75737F",
  border: "#E7E4F0",
  inputBg: "#F1EFF8",
  accent: "#6D5DF0",
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
  "#4F3FBF",
  "#6D5DF0",
  "#8B7CF6",
  "#A98CF7",
  "#C6ACF9",
  "#DFC9FB",
  "#EFE3FD",
];

// Retained for any lingering call sites during the redesign migration.
export const CATEGORY_HEX: string[] = CATEGORY_RAMP;
