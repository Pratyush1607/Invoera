import { createClient } from "@/lib/supabase/server";
import { attachDisplay, getDisplayContext } from "@/lib/currency";
import type { Expense, ExpenseCategory, ExpenseStatus } from "@/lib/types";

interface ExpenseRow {
  id: string;
  merchant: string;
  category: string;
  date: string;
  amount: number;
  currency: string;
  status: string;
}

function mapExpense(row: ExpenseRow): Omit<Expense, "displayAmount" | "displayCurrency"> {
  return {
    id: row.id,
    merchant: row.merchant,
    category: row.category as ExpenseCategory,
    date: row.date,
    amount: Number(row.amount),
    currency: row.currency,
    status: row.status as ExpenseStatus,
  };
}

export async function getExpenses(): Promise<Expense[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const [{ data, error }, ctx] = await Promise.all([
    supabase
      .from("expenses")
      .select("id, merchant, category, date, amount, currency, status")
      .eq("user_id", user.id)
      .order("date", { ascending: true })
      .returns<ExpenseRow[]>(),
    getDisplayContext(),
  ]);

  if (error || !data) return [];
  return attachDisplay(data.map(mapExpense), ctx);
}
