"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { ClientCard } from "@/components/clients/ClientCard";
import { ClientFilterPills, type ClientFilter } from "@/components/clients/ClientFilterPills";
import { RevenueGauge } from "@/components/clients/RevenueGauge";
import { Button } from "@/components/ui/Button";
import { getClientTotals } from "@/lib/calculations";
import { HIGH_VALUE_THRESHOLD } from "@/lib/constants";
import type { Client, ClientTotals } from "@/lib/types";

export function ClientsView({ clients, totals }: { clients: Client[]; totals: ClientTotals }) {
  const [filter, setFilter] = useState<ClientFilter>("All");
  const [query, setQuery] = useState("");

  const filteredClients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return clients.filter((client) => {
      if (!client.name.toLowerCase().includes(normalizedQuery)) return false;
      if (filter === "Active") return client.status === "active";
      if (filter === "Overdue") return client.status === "overdue";
      if (filter === "High-Value") return getClientTotals(client).total >= HIGH_VALUE_THRESHOLD;
      return true;
    });
  }, [clients, filter, query]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Clients</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {clients.length} clients on file
          </p>
        </div>
        <Link href="/clients/new">
          <Button className="shrink-0">
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Search clients..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded-full border border-gray-200 bg-white py-2.5 pr-4 pl-11 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-teal-500/20"
        />
      </div>

      <RevenueGauge totals={totals} />

      <ClientFilterPills active={filter} onChange={setFilter} />

      <div className="flex flex-col gap-3">
        {filteredClients.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
        {filteredClients.length === 0 && (
          <p className="py-12 text-center text-sm text-gray-400 dark:text-gray-500">
            No clients match your search.
          </p>
        )}
      </div>
    </div>
  );
}
