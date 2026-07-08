import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-accent/10 text-accent",
  active: "bg-accent/10 text-accent",
  processed: "bg-accent/10 text-accent",
  pending: "bg-warning/15 text-warning",
  "needs review": "bg-warning/15 text-warning",
  overdue: "bg-danger/10 text-danger",
};

export function StatusBadge({ status }: { status: string }) {
  const pulse = status === "overdue" ? "animate-pulse-once" : "";
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        STATUS_STYLES[status] ?? "bg-input-bg text-muted",
        pulse
      )}
    >
      {status}
    </span>
  );
}
