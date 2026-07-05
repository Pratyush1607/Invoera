export type InvoiceStatus = "paid" | "pending" | "overdue";

export interface Invoice {
  id: string;
  number: string;
  description: string;
  date: string;
  dueDate: string;
  amount: number;
  currency: string;
  displayAmount: number;
  displayCurrency: string;
  status: InvoiceStatus;
}

export type ClientStatus = "active" | "pending" | "overdue";

export interface Client {
  id: string;
  name: string;
  location: string;
  initials: string;
  color: string;
  status: ClientStatus;
  lastSentDaysAgo: number;
  invoices: Invoice[];
}

export interface ClientTotals {
  total: number;
  paid: number;
  pending: number;
  overdue: number;
  unpaid: number;
}

export type ExpenseCategory =
  | "Software"
  | "Travel"
  | "Office Supplies"
  | "Meals & Entertainment"
  | "Marketing"
  | "Professional Services"
  | "Utilities"
  | "Equipment";

export type ExpenseStatus = "processed" | "needs review";

export interface Expense {
  id: string;
  merchant: string;
  category: ExpenseCategory;
  date: string;
  amount: number;
  currency: string;
  displayAmount: number;
  displayCurrency: string;
  status: ExpenseStatus;
}

export type NotificationType = "invoice_overdue" | "expense_processed" | "weekly_summary";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  linkPath: string | null;
  readAt: string | null;
  createdAt: string;
}
