import { Search } from "lucide-react";
import { ProfileMenu } from "@/components/layout/ProfileMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { NotificationBell } from "@/components/layout/NotificationBell";
import type { AppNotification } from "@/lib/types";

export function Topbar({
  user,
  notifications,
  unreadCount,
}: {
  user: { email: string; displayName: string };
  notifications: AppNotification[];
  unreadCount: number;
}) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-gray-100 bg-white px-4 py-3 sm:px-6 lg:px-10 dark:border-gray-800 dark:bg-gray-900">
      <div className="hidden items-center gap-2 rounded-full bg-gray-50 px-4 py-2 text-sm text-gray-400 sm:flex sm:w-72 dark:bg-gray-800 dark:text-gray-500">
        <Search className="h-4 w-4" />
        <span>Search invoices, clients...</span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <ThemeToggle />
        <NotificationBell notifications={notifications} unreadCount={unreadCount} />
        <ProfileMenu user={user} />
      </div>
    </header>
  );
}
