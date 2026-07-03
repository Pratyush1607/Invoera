"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Settings, CreditCard, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { signOutAction } from "@/app/login/actions";
import { getInitials } from "@/lib/utils";

const MENU_ITEMS = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/plan", label: "Plan", icon: CreditCard },
];

export function ProfileMenu({
  user,
}: {
  user: { email: string; displayName: string };
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const initials = getInitials(user.displayName || user.email);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-teal-100"
      >
        <Avatar initials={initials} color="#0d9488" size={38} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-60 overflow-hidden rounded-2xl bg-white py-2 shadow-lg ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800"
        >
          <div className="px-4 py-2">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
              {user.displayName}
            </p>
            <p className="truncate text-xs text-gray-400 dark:text-gray-500">{user.email}</p>
          </div>
          <div className="my-1 border-t border-gray-100 dark:border-gray-800" />
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <div className="my-1 border-t border-gray-100 dark:border-gray-800" />
          <form action={signOutAction}>
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
