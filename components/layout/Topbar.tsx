import { Bell, Search } from "lucide-react";
import { ProfileMenu } from "@/components/layout/ProfileMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function Topbar({ user }: { user: { email: string; displayName: string } }) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-gray-100 bg-white px-4 py-3 sm:px-6 lg:px-10 dark:border-gray-800 dark:bg-gray-900">
      <div className="hidden items-center gap-2 rounded-full bg-gray-50 px-4 py-2 text-sm text-gray-400 sm:flex sm:w-72 dark:bg-gray-800 dark:text-gray-500">
        <Search className="h-4 w-4" />
        <span>Search invoices, clients...</span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <ThemeToggle />
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:bg-gray-50 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          <Bell className="h-5 w-5" />
        </button>
        <ProfileMenu user={user} />
      </div>
    </header>
  );
}
