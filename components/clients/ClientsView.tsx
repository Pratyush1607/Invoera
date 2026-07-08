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

export function ClientsView({
  clients,
  totals,
  displayCurrency,
}: {
  clients: Client[];
  totals: ClientTotals;
  displayCurrency: string;
}) {
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
    <div className="flex flex-col gap-5">
      <div className="animate-rise flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold text-text">My Clients</h1>
          <p className="truncate text-sm text-muted">{clients.length} clients on file</p>
        </div>
        <Link href="/clients/new" className="shrink-0">
          <Button className="shrink-0">
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </Link>
      </div>

      <div className="animate-rise relative" style={{ animationDelay: "0.05s" }}>
        <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search clients..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded-full border border-border bg-card py-2.5 pr-4 pl-11 text-sm text-text outline-none placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <div className="animate-rise" style={{ animationDelay: "0.1s" }}>
        <RevenueGauge totals={totals} displayCurrency={displayCurrency} />
      </div>

      <div className="animate-rise" style={{ animationDelay: "0.15s" }}>
        <ClientFilterPills active={filter} onChange={setFilter} />
      </div>

      <div className="flex flex-col gap-3">
        {filteredClients.map((client, index) => (
          <ClientCard key={client.id} client={client} index={index} />
        ))}
        {filteredClients.length === 0 && (
          <p className="py-12 text-center text-sm text-muted">No clients match your search.</p>
        )}
      </div>
    </div>
  );
}
