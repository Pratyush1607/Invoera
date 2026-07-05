"use server";

import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

const MAX_QUERY_LENGTH = 100;
const MAX_RESULTS_PER_TYPE = 5;

export interface SearchClientResult {
  id: string;
  name: string;
  location: string;
}

export interface SearchInvoiceResult {
  id: string;
  clientId: string;
  clientName: string;
  number: string;
  description: string;
  amount: number;
  currency: string;
}

export interface SearchResult {
  clients: SearchClientResult[];
  invoices: SearchInvoiceResult[];
}

const EMPTY_RESULT: SearchResult = { clients: [], invoices: [] };

interface InvoiceSearchRow {
  id: string;
  client_id: string;
  number: string;
  description: string;
  amount: number;
  currency: string;
  clients: { name: string } | null;
}

export async function searchAction(rawQuery: string): Promise<SearchResult> {
  const query = rawQuery.trim().slice(0, MAX_QUERY_LENGTH);
  if (query.length < 1) return EMPTY_RESULT;

  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return EMPTY_RESULT;
  if (!(await checkRateLimit(user.id, "search", 60, 60))) return EMPTY_RESULT;

  // Strip characters that have special meaning in PostgREST's filter syntax
  // so a search term can't break out of the .or() filter string.
  const safeQuery = query.replace(/[,()]/g, "");
  const likeQuery = `%${safeQuery}%`;

  const [{ data: clients }, { data: invoices }] = await Promise.all([
    supabase
      .from("clients")
      .select("id, name, location")
      .eq("user_id", user.id)
      .ilike("name", likeQuery)
      .order("name")
      .limit(MAX_RESULTS_PER_TYPE),
    supabase
      .from("invoices")
      .select("id, client_id, number, description, amount, currency, clients(name)")
      .eq("user_id", user.id)
      .or(`number.ilike.${likeQuery},description.ilike.${likeQuery}`)
      .order("date", { ascending: false })
      .limit(MAX_RESULTS_PER_TYPE)
      .returns<InvoiceSearchRow[]>(),
  ]);

  return {
    clients: (clients ?? []).map((client) => ({
      id: client.id,
      name: client.name,
      location: client.location,
    })),
    invoices: (invoices ?? []).map((invoice) => ({
      id: invoice.id,
      clientId: invoice.client_id,
      clientName: invoice.clients?.name ?? "",
      number: invoice.number,
      description: invoice.description,
      amount: Number(invoice.amount),
      currency: invoice.currency,
    })),
  };
}
