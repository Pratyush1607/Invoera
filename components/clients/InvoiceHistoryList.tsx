import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Invoice } from "@/lib/types";

export function InvoiceHistoryList({ invoices }: { invoices: Invoice[] }) {
  const sorted = [...invoices].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <Card className="p-5">
      <h3 className="font-bold text-gray-900 dark:text-gray-100">Invoice History</h3>
      <div className="mt-3 flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
        {sorted.map((invoice) => (
          <div key={invoice.id} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 dark:text-gray-100">{invoice.number}</p>
              <p className="truncate text-sm text-gray-400 dark:text-gray-500">
                {invoice.description}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {formatDate(invoice.date)}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(invoice.amount)}
              </p>
              <StatusBadge status={invoice.status} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
