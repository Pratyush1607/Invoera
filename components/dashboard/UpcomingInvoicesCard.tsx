import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import type { UpcomingInvoice } from "@/lib/calculations";

export function UpcomingInvoicesCard({ invoices }: { invoices: UpcomingInvoice[] }) {
  return (
    <Card className="flex-1 p-4.5">
      <p className="mb-3 text-xs font-bold text-text">Upcoming Invoices</p>
      {invoices.length === 0 ? (
        <p className="text-[12.5px] text-muted">No unpaid invoices — you&apos;re all caught up.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {invoices.map((inv) => (
            <div key={inv.invoiceId} className="flex items-center justify-between gap-2.5 text-[12.5px]">
              <span className="min-w-0 flex-1 truncate font-semibold text-text">{inv.clientName}</span>
              <span className="shrink-0 text-muted">
                {formatCurrency(inv.displayAmount, inv.displayCurrency)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
