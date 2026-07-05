import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export interface DisplayContext {
  displayCurrency: string;
  rates: Record<string, number>;
}

export const getDisplayContext = cache(async (): Promise<DisplayContext> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { displayCurrency: "USD", rates: { USD: 1 } };
  }

  const [{ data: profile }, { data: rateRow }] = await Promise.all([
    supabase.from("profiles").select("display_currency").eq("id", user.id).maybeSingle(),
    supabase.from("exchange_rates").select("rates").eq("id", 1).maybeSingle(),
  ]);

  return {
    displayCurrency: profile?.display_currency ?? "USD",
    rates: (rateRow?.rates as Record<string, number> | undefined) ?? { USD: 1 },
  };
});

export function convertAmount(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>
): number {
  if (from === to) return amount;
  const fromRate = rates[from] ?? 1;
  const toRate = rates[to] ?? 1;
  return (amount / fromRate) * toRate;
}

export function attachDisplay<T extends { amount: number; currency: string }>(
  rows: T[],
  ctx: DisplayContext
): (T & { displayAmount: number; displayCurrency: string })[] {
  return rows.map((row) => ({
    ...row,
    displayAmount: convertAmount(row.amount, row.currency, ctx.displayCurrency, ctx.rates),
    displayCurrency: ctx.displayCurrency,
  }));
}
