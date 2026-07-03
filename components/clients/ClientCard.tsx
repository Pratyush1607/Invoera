import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Client } from "@/lib/types";

export function ClientCard({ client }: { client: Client }) {
  return (
    <Link href={`/clients/${client.id}`}>
      <Card className="flex items-center gap-4 p-4 transition-shadow hover:shadow-md">
        <Avatar initials={client.initials} color={client.color} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-semibold text-gray-900 dark:text-gray-100">
              {client.name}
            </p>
            <StatusBadge status={client.status} />
          </div>
          <p className="mt-0.5 text-sm text-gray-400 dark:text-gray-500">
            {client.invoices.length} Invoices · Last sent {client.lastSentDaysAgo}d ago
          </p>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 dark:text-gray-600" />
      </Card>
    </Link>
  );
}
