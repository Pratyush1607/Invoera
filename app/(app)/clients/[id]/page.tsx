import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { StatTile } from "@/components/ui/StatTile";
import { InvoiceRatioCard } from "@/components/shared/InvoiceRatioCard";
import { InvoiceHistoryList } from "@/components/clients/InvoiceHistoryList";
import { getClientTotals } from "@/lib/calculations";
import { getClientById } from "@/lib/data/clients";
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

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/clients"
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to clients
      </Link>

      <div className="flex flex-col items-center gap-3 text-center">
        <Avatar initials={client.initials} color={client.color} size={64} />
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{client.name}</h1>
          <p className="mt-1 flex items-center justify-center gap-1 text-sm text-gray-400 dark:text-gray-500">
            <MapPin className="h-3.5 w-3.5" />
            {client.location}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatTile
          label="Total Invoice"
          value={formatCurrency(totals.total)}
          sublabel={`${client.invoices.length} Invoices`}
        />
        <StatTile
          label="Paid"
          value={formatCurrency(totals.paid)}
          valueClassName="text-teal-600 dark:text-teal-400"
        />
        <StatTile
          label="Unpaid"
          value={formatCurrency(totals.unpaid)}
          valueClassName="text-red-600 dark:text-red-400"
        />
      </div>

      <InvoiceRatioCard totals={totals} />

      <InvoiceHistoryList invoices={client.invoices} />
    </div>
  );
}
