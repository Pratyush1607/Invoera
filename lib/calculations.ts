import type { Client, ClientTotals, Expense, ExpenseCategory } from "./types";

export interface UpcomingInvoice {
  clientId: string;
  clientName: string;
  invoiceId: string;
  amount: number;
  displayAmount: number;
  displayCurrency: string;
  dueDate: string;
}

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

export function getUpcomingInvoices(clients: Client[], limit = 3): UpcomingInvoice[] {
  const upcoming: UpcomingInvoice[] = [];
  for (const client of clients) {
    for (const invoice of client.invoices) {
      if (invoice.status === "paid") continue;
      upcoming.push({
        clientId: client.id,
        clientName: client.name,
        invoiceId: invoice.id,
        amount: invoice.amount,
        displayAmount: invoice.displayAmount,
        displayCurrency: invoice.displayCurrency,
        dueDate: invoice.dueDate,
      });
    }
  }
  return upcoming.sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1)).slice(0, limit);
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

export function getMonthlyRevenue(
  clients: Client[]
): { key: string; label: string; amount: number }[] {
  const revenue = new Map<string, number>();
  for (const client of clients) {
    for (const invoice of client.invoices) {
      const key = invoice.date.slice(0, 7);
      revenue.set(key, (revenue.get(key) ?? 0) + invoice.displayAmount);
    }
  }
  return Array.from(revenue.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([key, amount]) => ({ key, label: monthLabel(key), amount }));
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
