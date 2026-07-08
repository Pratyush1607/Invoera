import { Sparkles, BellRing, BarChart3 } from "lucide-react";

const CARDS = [
  {
    icon: Sparkles,
    title: "Smart Categorization",
    desc: "Expenses are automatically sorted into the right category the moment they're uploaded.",
  },
  {
    icon: BellRing,
    title: "Automatic Reminders",
    desc: "Overdue invoices get nudged automatically, so you don't have to chase payments.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Reports",
    desc: "Live profit, spend, and revenue breakdowns update the second new data comes in.",
  },
];

export function FeatureCards() {
  return (
    <div className="relative mx-auto mt-24 max-w-5xl px-6 text-center">
      <div className="bg-section-glow pointer-events-none absolute top-[-40px] left-1/2 h-64 w-[640px] -translate-x-1/2" />

      <div className="relative z-10 mb-4.5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5">
        <span className="h-2 w-2 rotate-45 rounded-sm bg-accent-gradient" />
        <span className="text-[11.5px] font-extrabold tracking-wider text-muted uppercase">
          Smart Automation
        </span>
      </div>
      <h2 className="relative z-10 font-display text-[34px] font-extrabold tracking-tight text-text">
        Effortless invoicing,
        <br />
        automated expenses
      </h2>
      <p className="relative z-10 mx-auto mt-3.5 mb-11 max-w-lg text-[15px] leading-relaxed text-muted">
        Every receipt and invoice runs through an AI pipeline that reads, checks, and files it — no
        manual entry required.
      </p>

      <div className="relative z-10 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="rounded-2xl border border-border bg-card p-5.5">
              <span className="mb-4 flex h-9.5 w-9.5 items-center justify-center rounded-[11px] bg-accent-soft">
                <Icon className="h-4 w-4 text-accent" />
              </span>
              <p className="mb-1.5 text-[15.5px] font-bold text-text">{card.title}</p>
              <p className="text-[13.5px] leading-relaxed text-muted">{card.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
