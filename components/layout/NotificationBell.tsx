"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/app/(app)/notifications/actions";
import { formatRelativeTime } from "@/lib/utils";
import type { AppNotification } from "@/lib/types";

export function NotificationBell({
  notifications,
  unreadCount,
}: {
  notifications: AppNotification[];
  unreadCount: number;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  async function handleNotificationClick(notification: AppNotification) {
    setOpen(false);
    if (!notification.readAt) {
      await markNotificationReadAction(notification.id);
    }
    if (notification.linkPath) {
      router.push(notification.linkPath);
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted hover:bg-input-bg hover:text-text"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-text">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="animate-drop-in absolute right-0 z-20 mt-2 w-80 overflow-hidden rounded-2xl bg-card shadow-lg ring-1 ring-border"
        >
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-text">Notifications</p>
            {unreadCount > 0 && (
              <form
                action={async () => {
                  await markAllNotificationsReadAction();
                }}
              >
                <button type="submit" className="text-xs font-semibold text-accent hover:opacity-80">
                  Mark all as read
                </button>
              </form>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-muted">No notifications yet.</p>
            )}
            {notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                role="menuitem"
                onClick={() => handleNotificationClick(notification)}
                className="flex w-full flex-col gap-0.5 border-b border-border px-4 py-3 text-left last:border-0 hover:bg-input-bg"
              >
                <div className="flex items-center gap-2">
                  {!notification.readAt && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  )}
                  <p className="truncate text-sm font-semibold text-text">{notification.title}</p>
                </div>
                <p className="truncate text-xs text-muted">{notification.body}</p>
                <p className="text-xs text-muted">{formatRelativeTime(notification.createdAt)}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
