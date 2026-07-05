import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ConfirmSubmitButton } from "@/components/shared/ConfirmSubmitButton";
import { markInvoicePaidAction, deleteInvoiceAction } from "@/app/(app)/clients/actions";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Invoice } from "@/lib/types";

export function InvoiceHistoryList({
  clientId,
  invoices,
}: {
  clientId: string;
  invoices: Invoice[];
}) {
  const sorted = [...invoices].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-bold text-gray-900 dark:text-gray-100">Invoice History</h3>
        <Link
          href={`/clients/${clientId}/invoices/new`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
        >
          <Plus className="h-4 w-4" />
          New Invoice
        </Link>
      </div>
      <div className="mt-3 flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
        {sorted.map((invoice) => (
          <div key={invoice.id} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 dark:text-gray-100">{invoice.number}</p>
              <p className="truncate text-sm text-gray-400 dark:text-gray-500">
                {invoice.description}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Issued {formatDate(invoice.date)} · Due {formatDate(invoice.dueDate)}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(invoice.amount)}
              </p>
              <StatusBadge status={invoice.status} />
              {invoice.status !== "paid" && (
                <form action={markInvoicePaidAction.bind(null, invoice.id, clientId)}>
                  <button
                    type="submit"
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                  >
                    Mark as Paid
                  </button>
                </form>
              )}
              <form action={deleteInvoiceAction.bind(null, invoice.id, clientId)}>
                <ConfirmSubmitButton
                  confirmMessage={`Delete invoice ${invoice.number}? This can't be undone.`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </ConfirmSubmitButton>
              </form>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
