import type { Client, ClientTotals, Expense, ExpenseCategory } from "./types";

export function getClientTotals(client: Client): ClientTotals {
  const totals = client.invoices.reduce(
    (acc, invoice) => {
      acc.total += invoice.amount;
      acc[invoice.status] += invoice.amount;
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
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

export function getCategoryBreakdown(
  expenses: Expense[]
): { category: ExpenseCategory; amount: number }[] {
  const totals = new Map<ExpenseCategory, number>();
  for (const expense of expenses) {
    totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount);
  }
  return Array.from(totals.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function getMonthlyBreakdown(expenses: Expense[]): { month: string; amount: number }[] {
  const totals = new Map<string, number>();
  for (const expense of expenses) {
    const month = new Date(expense.date).toLocaleDateString("en-US", { month: "short" });
    totals.set(month, (totals.get(month) ?? 0) + expense.amount);
  }
  return Array.from(totals.entries()).map(([month, amount]) => ({ month, amount }));
}
