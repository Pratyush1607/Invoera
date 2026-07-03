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
              ? "bg-teal-700 text-white"
              : "bg-white text-gray-500 ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-gray-700"
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
