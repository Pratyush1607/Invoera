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
        className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
      >
        <Avatar initials={initials} color="#6D5DF0" size={38} />
      </button>

      {open && (
        <div
          role="menu"
          className="animate-drop-in absolute right-0 z-20 mt-2 w-60 overflow-hidden rounded-2xl bg-card py-2 shadow-lg ring-1 ring-border"
        >
          <div className="px-4 py-2">
            <p className="truncate text-sm font-semibold text-text">{user.displayName}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
          <div className="my-1 border-t border-border" />
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted hover:bg-input-bg hover:text-text"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <div className="my-1 border-t border-border" />
          <form action={signOutAction}>
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-danger hover:bg-danger/10"
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
