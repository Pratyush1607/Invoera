import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { UserPlus, ReceiptText, BarChart3, Settings, Bell } from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { AppNotification } from "@/lib/types";

const QUICK_ACTIONS = [
  { label: "Client", href: "/clients/new", icon: UserPlus },
  { label: "Expense", href: "/expenses/new", icon: ReceiptText },
  { label: "Reports", href: "/expenses", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function AccountCard({ notifications }: { notifications: AppNotification[] }) {
  const unreadCount = notifications.filter((n) => !n.readAt).length;

  return (
    <div className="flex flex-col gap-3.5">
      <div
        className="rounded-2xl p-4.5 text-white shadow-[0_16px_32px_-12px_rgba(139,89,246,0.4)]"
        style={{ background: "linear-gradient(135deg, #322c58, #17151f)" }}
      >
        <div className="mb-3.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[13px] font-bold">
            <Bell className="h-3.5 w-3.5" />
            Notifications
          </span>
          {unreadCount > 0 && (
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold">
              {unreadCount} new
            </span>
          )}
        </div>

        {notifications.length === 0 ? (
          <p className="text-[12px] text-white/60">You&apos;re all caught up.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {notifications.slice(0, 3).map((notification) => (
              <Link
                key={notification.id}
                href={notification.linkPath ?? "/dashboard"}
                className="-mx-1 flex items-start gap-2 rounded-lg px-1 py-0.5 hover:bg-white/5"
              >
                <span
                  className={cn(
                    "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                    notification.readAt ? "bg-white/20" : "bg-accent"
                  )}
                />
                <span className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold">{notification.title}</p>
                  <p className="text-[10px] text-white/50">{formatRelativeTime(notification.createdAt)}</p>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Link
          href="/expenses"
          className="flex-1 rounded-full bg-accent-gradient py-2.75 text-center text-[11.5px] font-bold whitespace-nowrap text-white"
        >
          Expenses
        </Link>
        <Link
          href="/clients"
          className="flex-1 rounded-full border border-border bg-card py-2.75 text-center text-[11.5px] font-bold whitespace-nowrap text-text"
        >
          Clients
        </Link>
      </div>

      <Card className="p-4">
        <p className="mb-3 text-[11px] font-bold tracking-wide text-muted uppercase">Quick Action</p>
        <div className="grid grid-cols-4 gap-2">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col items-center gap-1.5 text-center"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-input-bg">
                  <Icon className="h-3.5 w-3.5 text-accent" />
                </span>
                <span className="text-[9px] text-muted">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
