const CLIENT_ROWS = [
  { name: "Aurora Studio", label: "Active" },
  { name: "Nimbus Retail", label: "Overdue" },
];

const EXPENSE_BARS = [
  { label: "Software", pct: "72%" },
  { label: "Marketing", pct: "48%" },
  { label: "Travel", pct: "30%" },
];

const REMINDER_ROWS = [
  { name: "Beacon Labs", due: "Due in 3 days" },
  { name: "Cedar & Co", due: "Due tomorrow" },
];

export function FeatureGrid() {
  return (
    <div id="features" className="relative mx-auto mt-28 max-w-5xl scroll-mt-24 px-6">
      <div className="bg-section-glow pointer-events-none absolute top-[-40px] left-0 h-64 w-[480px]" />

      <div className="relative z-10 mb-4.5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5">
        <span className="h-2 w-2 rotate-45 rounded-sm bg-accent-gradient" />
        <span className="text-[11.5px] font-extrabold tracking-wider text-muted uppercase">Features</span>
      </div>
      <div className="relative z-10 mb-10 flex flex-wrap justify-between gap-6">
        <h2 className="max-w-sm font-display text-[32px] font-extrabold tracking-tight text-text">
          Everything your business finances need
        </h2>
        <p className="max-w-sm text-[14.5px] leading-relaxed text-muted">
          From client invoices to expense tracking, Invoera keeps your books current without the
          busywork.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-[18px] border border-border bg-card p-6">
          <p className="mb-1 text-[15.5px] font-bold text-text">Client Management</p>
          <p className="mb-4.5 text-[13px] text-muted">See every client&apos;s status at a glance.</p>
          <div className="flex flex-col gap-2">
            {CLIENT_ROWS.map((row) => (
              <div
                key={row.name}
                className="flex items-center justify-between rounded-[11px] bg-input-bg px-3.5 py-2.5"
              >
                <span className="text-[13px] font-semibold text-text">{row.name}</span>
                <span
                  className={
                    row.label === "Active"
                      ? "rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] font-bold text-accent"
                      : "rounded-full bg-danger/10 px-2.5 py-0.5 text-[11px] font-bold text-danger"
                  }
                >
                  {row.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[18px] border border-border bg-card p-6">
          <p className="mb-1 text-[15.5px] font-bold text-text">Invoice Tracking</p>
          <p className="mb-4.5 text-[13px] text-muted">Know exactly what&apos;s paid, pending, or late.</p>
          <div
            className="rounded-[13px] p-4 text-white"
            style={{ background: "linear-gradient(135deg, #2a2840, #17151f)" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wide opacity-70">INVOICE #1042</span>
              <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-bold">Pending</span>
            </div>
            <p className="font-display text-[22px] font-extrabold">$4,300.00</p>
          </div>
        </div>

        <div className="rounded-[18px] border border-border bg-card p-6">
          <p className="mb-1 text-[15.5px] font-bold text-text">Expense Categories</p>
          <p className="mb-4.5 text-[13px] text-muted">Spend broken down automatically by type.</p>
          <div className="flex flex-col gap-2.5">
            {EXPENSE_BARS.map((bar) => (
              <div key={bar.label} className="flex items-center gap-2.5">
                <span className="w-[70px] shrink-0 text-xs text-muted">{bar.label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-input-bg">
                  <div className="h-full rounded-full bg-accent-gradient" style={{ width: bar.pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[18px] border border-border bg-card p-6">
          <p className="mb-1 text-[15.5px] font-bold text-text">Payment Reminders</p>
          <p className="mb-4.5 text-[13px] text-muted">Automatic nudges before invoices go overdue.</p>
          <div className="flex flex-col gap-2">
            {REMINDER_ROWS.map((row) => (
              <div
                key={row.name}
                className="flex items-center justify-between rounded-[11px] bg-input-bg px-3.5 py-2.5"
              >
                <span className="text-[13px] font-semibold text-text">{row.name}</span>
                <span className="text-xs text-muted">{row.due}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
