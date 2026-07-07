import { ProfileMenu } from "@/components/layout/ProfileMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { SearchBar } from "@/components/layout/SearchBar";
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
    <header className="flex items-center justify-between gap-4 border-b border-border bg-surface px-4 py-3 sm:px-6 lg:px-10">
      <SearchBar />
      <div className="ml-auto flex items-center gap-3">
        <ThemeToggle />
        <NotificationBell notifications={notifications} unreadCount={unreadCount} />
        <ProfileMenu user={user} />
      </div>
    </header>
  );
}
