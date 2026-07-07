import { ClientsView } from "@/components/clients/ClientsView";
import { PageBackground } from "@/components/layout/PageBackground";
import { getOverallInvoiceTotals } from "@/lib/calculations";
import { getClients } from "@/lib/data/clients";
import { getDisplayContext } from "@/lib/currency";

export default async function ClientsPage() {
  const [clients, { displayCurrency }] = await Promise.all([getClients(), getDisplayContext()]);
  const totals = getOverallInvoiceTotals(clients);

  return (
    <PageBackground>
      <ClientsView clients={clients} totals={totals} displayCurrency={displayCurrency} />
    </PageBackground>
  );
}
