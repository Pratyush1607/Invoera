import { createClient } from "@/lib/supabase/server";
import { daysAgo } from "@/lib/utils";
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
    amount: number;
    status: string;
  }[];
}

const CLIENT_SELECT =
  "id, name, location, initials, color, status, last_sent_at, invoices(id, number, description, date, amount, status)";

function mapInvoice(row: ClientRow["invoices"][number]): Invoice {
  return {
    id: row.id,
    number: row.number,
    description: row.description,
    date: row.date,
    amount: Number(row.amount),
    status: row.status as InvoiceStatus,
  };
}

function mapClient(row: ClientRow): Client {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    initials: row.initials,
    color: row.color,
    status: row.status as ClientStatus,
    lastSentDaysAgo: row.last_sent_at ? daysAgo(row.last_sent_at) : 0,
    invoices: (row.invoices ?? []).map(mapInvoice),
  };
}

export async function getClients(): Promise<Client[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("clients")
    .select(CLIENT_SELECT)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .returns<ClientRow[]>();

  if (error || !data) return [];
  return data.map(mapClient);
}

export async function getClientById(id: string): Promise<Client | undefined> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return undefined;

  const { data, error } = await supabase
    .from("clients")
    .select(CLIENT_SELECT)
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle()
    .returns<ClientRow>();

  if (error || !data) return undefined;
  return mapClient(data);
}
