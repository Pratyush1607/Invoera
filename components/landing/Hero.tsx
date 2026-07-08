import Link from "next/link";
import { UploadCloud, Sparkles, PieChart, Bell } from "lucide-react";

const HERO_TABS = ["Dashboard", "Clients", "Expenses", "Settings"];

const UPCOMING_INVOICES = [
  { name: "Aurora Studio", amount: "$4,300" },
  { name: "Solstice Co", amount: "$24,800" },
];

const PREVIEW_NOTIFICATIONS = [
  { title: "Invoice #1042 paid", time: "2h ago" },
  { title: "Receipt processed", time: "5h ago" },
];

const TOP_CATEGORIES = [
  { label: "Marketing", pct: "62%" },
  { label: "Travel", pct: "41%" },
  { label: "Office", pct: "23%" },
];

// Static illustrative sparkline path — purely decorative marketing chrome, not real data.
const SPARK_PATH = "M0,68 C40,50 70,58 100,40 C130,26 160,44 190,30 C220,18 250,10 280,4";
const SPARK_AREA = `${SPARK_PATH} L280,90 L0,90 Z`;

export function Hero() {
  return (
    <div className="relative overflow-hidden px-6 pt-20 pb-10 text-center">
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="animate-rise mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5">
          <span className="h-2 w-2 shrink-0 rotate-45 rounded-sm bg-accent-gradient" />
          <span className="text-[11.5px] font-extrabold tracking-wider text-muted uppercase">
            AI-Powered Finance
          </span>
        </div>

        <h1
          className="animate-rise font-display text-4xl leading-tight font-extrabold tracking-tight text-text sm:text-5xl"
          style={{ animationDelay: "0.05s" }}
        >
          Invoicing and expenses,
          <br />
          handled by AI
        </h1>
        <p
          className="animate-rise mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted"
          style={{ animationDelay: "0.1s" }}
        >
          Upload a receipt or invoice and a multi-agent pipeline extracts, validates, and categorizes it
          — so your dashboard is always up to date.
        </p>

        <div
          className="animate-rise mt-8 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "0.15s" }}
        >
          <Link
            href="/login?mode=signup"
            className="rounded-full bg-accent-gradient px-6.5 py-3.5 text-sm font-bold whitespace-nowrap text-white"
          >
            Get Started
          </Link>
          <a
            href="#features"
            className="rounded-full border border-border bg-card px-6.5 py-3.5 text-sm font-bold whitespace-nowrap text-text"
          >
            See How It Works
          </a>
        </div>
      </div>

      {/* Decorative dashboard preview — illustrative marketing content only, not real data. */}
      <div
        id="dashboard-preview"
        className="animate-rise relative z-10 mx-auto mt-14 max-w-5xl scroll-mt-24 text-left"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="overflow-hidden rounded-[20px] border border-border bg-card shadow-[0_50px_100px_-20px_rgba(139,89,246,0.25)]">
          <div className="flex items-center gap-4 border-b border-border px-5 py-3.5">
            <span className="h-7 w-7 shrink-0 rounded-full bg-accent-gradient" />
            <div className="flex items-center gap-1.5">
              {HERO_TABS.map((tab, i) => (
                <span
                  key={tab}
                  className={
                    i === 0
                      ? "rounded-full bg-accent-soft px-3 py-1.5 text-[11.5px] font-bold whitespace-nowrap text-accent"
                      : "hidden rounded-full px-3 py-1.5 text-[11.5px] font-bold whitespace-nowrap text-muted sm:inline-block"
                  }
                >
                  {tab}
                </span>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2.5">
              <span className="hidden h-6.5 w-36 rounded-full bg-input-bg sm:block" />
              <span className="h-6.5 w-6.5 shrink-0 rounded-full bg-input-bg" />
              <span className="h-6.5 w-6.5 shrink-0 rounded-full bg-accent-gradient" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3">
            <div className="flex flex-col gap-3.5">
              <div className="rounded-[15px] bg-input-bg p-4.5">
                <div className="mb-2.5 flex items-center justify-between">
                  <p className="text-[11px] font-bold tracking-wide text-muted uppercase">Total Invoiced</p>
                  <span className="text-[11px] font-bold text-accent">+92%</span>
                </div>
                <p className="mb-3.5 font-display text-2xl font-extrabold text-text">$77,000</p>
                <svg viewBox="0 0 280 90" className="h-16 w-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="heroSpark" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={SPARK_AREA} fill="url(#heroSpark)" stroke="none" />
                  <path d={SPARK_PATH} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex-1 rounded-[15px] bg-input-bg p-4.5">
                <p className="mb-3 text-xs font-bold text-text">Upcoming Invoices</p>
                <div className="flex flex-col gap-2.5">
                  {UPCOMING_INVOICES.map((inv) => (
                    <div key={inv.name} className="flex items-center justify-between gap-2.5 text-[12.5px]">
                      <span className="min-w-0 flex-1 truncate font-semibold text-text">{inv.name}</span>
                      <span className="shrink-0 text-muted">{inv.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3.5">
              <div className="rounded-[15px] bg-input-bg p-4.5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[11px] font-bold tracking-wide text-muted uppercase">Total Spend</p>
                  <UploadCloud className="h-3.5 w-3.5 text-accent" />
                </div>
                <p className="font-display text-[22px] font-extrabold text-text">$6,052</p>
              </div>
              <div className="flex-1 rounded-[15px] bg-input-bg p-4">
                <div className="mb-2.5 flex items-center justify-between">
                  <p className="text-[11px] font-bold tracking-wide text-muted uppercase">Budget Used</p>
                  <span className="text-[11px] font-bold text-text">8%</span>
                </div>
                <div className="mb-3.5 h-2 overflow-hidden rounded-full bg-card">
                  <div className="h-full w-[8%] rounded-full bg-accent-gradient" />
                </div>
                <div className="flex flex-col gap-2">
                  {TOP_CATEGORIES.map((cat) => (
                    <div key={cat.label} className="flex items-center gap-2 text-xs">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span className="flex-1 text-muted">{cat.label}</span>
                      <span className="font-bold text-text">{cat.pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3.5">
              <div
                className="rounded-[15px] p-4.5 text-white shadow-[0_16px_32px_-12px_rgba(139,89,246,0.5)]"
                style={{ background: "linear-gradient(135deg, #322c58, #17151f)" }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[12px] font-bold">
                    <Bell className="h-3.5 w-3.5" />
                    Notifications
                  </span>
                  <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold">2 new</span>
                </div>
                <div className="flex flex-col gap-2">
                  {PREVIEW_NOTIFICATIONS.map((notification) => (
                    <div key={notification.title}>
                      <p className="text-[11.5px] font-semibold">{notification.title}</p>
                      <p className="text-[10px] text-white/50">{notification.time}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <span className="flex-1 rounded-full bg-accent-gradient py-2.5 text-center text-[11.5px] font-bold whitespace-nowrap text-white">
                  <Sparkles className="mx-auto h-3.5 w-3.5" />
                </span>
                <span className="flex-1 rounded-full border border-border bg-card py-2.5 text-center text-[11.5px] font-bold whitespace-nowrap text-text">
                  <PieChart className="mx-auto h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
