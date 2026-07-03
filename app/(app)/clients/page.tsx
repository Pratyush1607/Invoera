import { ClientsView } from "@/components/clients/ClientsView";
import { getOverallInvoiceTotals } from "@/lib/calculations";
import { getClients } from "@/lib/data/clients";

export default async function ClientsPage() {
  const clients = await getClients();
  const totals = getOverallInvoiceTotals(clients);

  return <ClientsView clients={clients} totals={totals} />;
}
