"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/app/login/actions";
import { Logo } from "@/components/ui/Logo";
import { NAV_ITEMS, NAV_ROW_STRIDE } from "./nav-items";

export function Sidebar() {
  const pathname = usePathname();
  const activeIndex = NAV_ITEMS.findIndex(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card px-4 py-6 lg:flex">
      <Link href="/dashboard" className="flex items-center gap-2 px-2">
        <Logo />
        <span className="font-display text-lg font-bold text-text">Invoera</span>
      </Link>

      <nav className="relative mt-8 flex flex-1 flex-col gap-[3px]">
        {activeIndex >= 0 && (
          <div
            className="absolute left-0 h-[42px] w-full rounded-xl bg-accent/10 transition-transform duration-[280ms] ease-[cubic-bezier(.2,.8,.2,1)]"
            style={{ transform: `translateY(${activeIndex * NAV_ROW_STRIDE}px)` }}
          />
        )}
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex h-[42px] items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
                active ? "text-accent" : "text-muted hover:text-text"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form action={signOutAction}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-muted hover:bg-input-bg hover:text-text"
        >
          <LogOut className="h-5 w-5" />
          Log out
        </button>
      </form>
    </aside>
  );
}
