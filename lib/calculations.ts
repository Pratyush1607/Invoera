import type { Client, ClientTotals, Expense, ExpenseCategory } from "./types";

export function getClientTotals(client: Client): ClientTotals {
  const totals = client.invoices.reduce(
    (acc, invoice) => {
      acc.total += invoice.displayAmount;
      acc[invoice.status] += invoice.displayAmount;
      return acc;
    },
    { total: 0, paid: 0, pending: 0, overdue: 0 }
  );
  return { ...totals, unpaid: totals.pending + totals.overdue };
}

export function getOverallInvoiceTotals(clients: Client[]): ClientTotals {
  return clients.reduce<ClientTotals>(
    (acc, client) => {
      const totals = getClientTotals(client);
      acc.total += totals.total;
      acc.paid += totals.paid;
      acc.pending += totals.pending;
      acc.overdue += totals.overdue;
      acc.unpaid += totals.unpaid;
      return acc;
    },
    { total: 0, paid: 0, pending: 0, overdue: 0, unpaid: 0 }
  );
}

export function getTotalExpenses(expenses: Expense[]): number {
  return expenses.reduce((sum, expense) => sum + expense.displayAmount, 0);
}

export function getCategoryBreakdown(
  expenses: Expense[]
): { category: ExpenseCategory; amount: number }[] {
  const totals = new Map<ExpenseCategory, number>();
  for (const expense of expenses) {
    totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.displayAmount);
  }
  return Array.from(totals.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

function monthLabel(key: string): string {
  return new Date(`${key}-01`).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

export function getMonthlySpend(
  expenses: Expense[]
): { key: string; label: string; amount: number }[] {
  const totals = new Map<string, number>();
  for (const expense of expenses) {
    const key = expense.date.slice(0, 7);
    totals.set(key, (totals.get(key) ?? 0) + expense.displayAmount);
  }
  return Array.from(totals.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([key, amount]) => ({ key, label: monthLabel(key), amount }));
}

export function getAnnualSpend(
  expenses: Expense[]
): { key: string; label: string; amount: number }[] {
  const totals = new Map<string, number>();
  for (const expense of expenses) {
    const key = expense.date.slice(0, 4);
    totals.set(key, (totals.get(key) ?? 0) + expense.displayAmount);
  }
  return Array.from(totals.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([key, amount]) => ({ key, label: key, amount }));
}

export function getMonthlyProfitLoss(
  clients: Client[],
  expenses: Expense[]
): { key: string; label: string; profit: number }[] {
  const revenue = new Map<string, number>();
  for (const client of clients) {
    for (const invoice of client.invoices) {
      const key = invoice.date.slice(0, 7);
      revenue.set(key, (revenue.get(key) ?? 0) + invoice.displayAmount);
    }
  }

  const spend = new Map<string, number>();
  for (const expense of expenses) {
    const key = expense.date.slice(0, 7);
    spend.set(key, (spend.get(key) ?? 0) + expense.displayAmount);
  }

  const keys = new Set([...revenue.keys(), ...spend.keys()]);
  return Array.from(keys)
    .sort((a, b) => (a < b ? -1 : 1))
    .map((key) => ({
      key,
      label: monthLabel(key),
      profit: (revenue.get(key) ?? 0) - (spend.get(key) ?? 0),
    }));
}
