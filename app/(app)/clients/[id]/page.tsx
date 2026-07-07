import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { StatTile } from "@/components/ui/StatTile";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { InvoiceRatioCard } from "@/components/shared/InvoiceRatioCard";
import { InvoiceHistoryList } from "@/components/clients/InvoiceHistoryList";
import { PageBackground } from "@/components/layout/PageBackground";
import { getClientTotals } from "@/lib/calculations";
import { getClientById } from "@/lib/data/clients";
import { getDisplayContext } from "@/lib/currency";
import { formatCurrency } from "@/lib/utils";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClientById(id);
  if (!client) notFound();

  const totals = getClientTotals(client);
  const { displayCurrency } = await getDisplayContext();

  return (
    <PageBackground>
      <div className="flex flex-col gap-5">
        <Link
          href="/clients"
          className="animate-rise inline-flex w-fit items-center gap-2 text-sm font-medium text-muted hover:text-text"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to clients
        </Link>

        <div className="animate-rise flex items-center gap-3.5" style={{ animationDelay: "0.05s" }}>
          <Avatar initials={client.initials} color={client.color} size={52} />
          <div>
            <h1 className="font-display text-xl font-bold text-text">{client.name}</h1>
            <div className="mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1 text-sm text-muted">
                <MapPin className="h-3.5 w-3.5" />
                {client.location}
              </span>
              <StatusBadge status={client.status} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile
            label="Total"
            value={formatCurrency(totals.total, displayCurrency)}
            sublabel={`${client.invoices.length} invoices`}
          />
          <StatTile
            label="Paid"
            value={formatCurrency(totals.paid, displayCurrency)}
            valueClassName="text-accent"
          />
          <StatTile
            label="Pending"
            value={formatCurrency(totals.pending, displayCurrency)}
            valueClassName="text-warning"
          />
          <StatTile
            label="Overdue"
            value={formatCurrency(totals.overdue, displayCurrency)}
            valueClassName="text-danger"
          />
        </div>

        <InvoiceRatioCard totals={totals} displayCurrency={displayCurrency} />

        <InvoiceHistoryList clientId={client.id} invoices={client.invoices} />
      </div>
    </PageBackground>
  );
}
