import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Client } from "@/lib/types";

export function ClientCard({ client, index = 0 }: { client: Client; index?: number }) {
  const delay = `${Math.min(0.05 + index * 0.04, 0.4)}s`;

  return (
    <Link href={`/clients/${client.id}`}>
      <Card
        className="animate-rise flex items-center gap-4 p-4 transition-shadow hover:shadow-md"
        style={{ animationDelay: delay }}
      >
        <Avatar initials={client.initials} color={client.color} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-semibold text-text">{client.name}</p>
            <StatusBadge status={client.status} />
          </div>
          <p className="mt-0.5 text-sm text-muted">
            {client.invoices.length} Invoices · Last sent {client.lastSentDaysAgo}d ago
          </p>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
      </Card>
    </Link>
  );
}
