import { createClient } from "@/lib/supabase/server";
import { daysAgo } from "@/lib/utils";
import { convertAmount, getDisplayContext, type DisplayContext } from "@/lib/currency";
import type { Client, ClientStatus, Invoice, InvoiceStatus } from "@/lib/types";

interface ClientRow {
  id: string;
  name: string;
  location: string;
  initials: string;
  color: string;
  status: string;
  last_sent_at: string | null;
  invoices: {
    id: string;
    number: string;
    description: string;
    date: string;
    due_date: string;
    amount: number;
    currency: string;
    status: string;
  }[];
}

const CLIENT_SELECT =
  "id, name, location, initials, color, status, last_sent_at, invoices(id, number, description, date, due_date, amount, currency, status)";

function deriveInvoiceStatus(status: string, dueDate: string): InvoiceStatus {
  if (status === "paid") return "paid";
  const today = new Date().toISOString().slice(0, 10);
  return dueDate < today ? "overdue" : "pending";
}

function mapInvoice(row: ClientRow["invoices"][number], ctx: DisplayContext): Invoice {
  const amount = Number(row.amount);
  return {
    id: row.id,
    number: row.number,
    description: row.description,
    date: row.date,
    dueDate: row.due_date,
    amount,
    currency: row.currency,
    displayAmount: convertAmount(amount, row.currency, ctx.displayCurrency, ctx.rates),
    displayCurrency: ctx.displayCurrency,
    status: deriveInvoiceStatus(row.status, row.due_date),
  };
}

function mapClient(row: ClientRow, ctx: DisplayContext): Client {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    initials: row.initials,
    color: row.color,
    status: row.status as ClientStatus,
    lastSentDaysAgo: row.last_sent_at ? daysAgo(row.last_sent_at) : 0,
    invoices: (row.invoices ?? []).map((invoice) => mapInvoice(invoice, ctx)),
  };
}

export async function getClients(): Promise<Client[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const [{ data, error }, ctx] = await Promise.all([
    supabase
      .from("clients")
      .select(CLIENT_SELECT)
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .returns<ClientRow[]>(),
    getDisplayContext(),
  ]);

  if (error || !data) return [];
  return data.map((row) => mapClient(row, ctx));
}

export async function getClientById(id: string): Promise<Client | undefined> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return undefined;

  const [{ data, error }, ctx] = await Promise.all([
    supabase
      .from("clients")
      .select(CLIENT_SELECT)
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle()
      .returns<ClientRow>(),
    getDisplayContext(),
  ]);

  if (error || !data) return undefined;
  return mapClient(data, ctx);
}
