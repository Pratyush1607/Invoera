import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400",
  active: "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400",
  processed: "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400",
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  "needs review": "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  overdue: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
      )}
    >
      {status}
    </span>
  );
}
