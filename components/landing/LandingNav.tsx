"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#dashboard-preview", label: "Dashboard" },
  { href: "#faq", label: "FAQ" },
];

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-nav-bar px-6 py-4 backdrop-blur-lg">
      <Link href="/" className="flex shrink-0 items-center gap-2.5">
        <Logo />
        <span className="font-display text-lg font-extrabold tracking-tight text-text">Invoera</span>
      </Link>

      <nav className="mx-auto hidden items-center gap-7 text-sm font-semibold md:flex">
        {LINKS.map((link) => (
          <a key={link.href} href={link.href} className="text-muted hover:text-text">
            {link.label}
          </a>
        ))}
      </nav>

      <div className="ml-auto flex shrink-0 items-center gap-2.5">
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>
        <Link
          href="/login"
          className="hidden rounded-full border border-border bg-card px-4 py-2 text-[13.5px] font-bold text-text whitespace-nowrap hover:bg-input-bg sm:inline-block"
        >
          Sign In
        </Link>
        <Link
          href="/login?mode=signup"
          className="rounded-full bg-accent-gradient px-4.5 py-2 text-[13.5px] font-bold whitespace-nowrap text-white"
        >
          Get Started
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card md:hidden"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="animate-drop-in absolute top-full right-0 left-0 flex flex-col gap-1 border-b border-border bg-card p-3 md:hidden">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-text hover:bg-input-bg"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-1 flex items-center justify-between px-3 py-1 sm:hidden">
            <span className="text-sm font-semibold text-muted">Appearance</span>
            <ThemeToggle />
          </div>
          <Link
            href="/login"
            className="mt-1 rounded-lg border border-border px-3 py-2.5 text-center text-sm font-semibold text-text sm:hidden"
          >
            Sign In
          </Link>
        </div>
      )}
    </header>
  );
}
