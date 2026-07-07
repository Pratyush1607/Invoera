"use client";

import { cn } from "@/lib/utils";

const FILTERS = ["All", "Active", "Overdue", "High-Value"] as const;

export type ClientFilter = (typeof FILTERS)[number];

export function ClientFilterPills({
  active,
  onChange,
}: {
  active: ClientFilter;
  onChange: (filter: ClientFilter) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => onChange(filter)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
            active === filter
              ? "bg-accent text-accent-text"
              : "bg-surface text-muted ring-1 ring-border hover:bg-surface-inset"
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
