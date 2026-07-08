import Link from "next/link";
import { ProfileMenu } from "@/components/layout/ProfileMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { SearchBar } from "@/components/layout/SearchBar";
import { Logo } from "@/components/ui/Logo";
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
    <header className="flex items-center justify-between gap-4 border-b border-border bg-card px-4 py-3 sm:px-6 lg:px-10">
      <Link href="/dashboard" className="flex shrink-0 items-center gap-2 lg:hidden">
        <Logo size="sm" />
        <span className="font-display text-base font-bold text-text">Invoera</span>
      </Link>
      <SearchBar />
      <div className="ml-auto flex items-center gap-3">
        <ThemeToggle />
        <NotificationBell notifications={notifications} unreadCount={unreadCount} />
        <ProfileMenu user={user} />
      </div>
    </header>
  );
}
