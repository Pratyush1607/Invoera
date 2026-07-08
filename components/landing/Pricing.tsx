"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const FREE_FEATURES = [
  "Unlimited clients",
  "AI invoice + expense automation",
  "Real-time reports",
  "Multi-currency support",
  "Email support",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Team seats",
  "Custom branding",
  "Priority support",
];

export function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <div id="pricing" className="relative mx-auto mt-28 max-w-5xl scroll-mt-24 px-6 text-center">
      <div className="bg-section-glow pointer-events-none absolute top-[-40px] left-1/2 h-64 w-[640px] -translate-x-1/2" />

      <div className="relative z-10 mb-4.5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5">
        <span className="h-2 w-2 rotate-45 rounded-sm bg-accent-gradient" />
        <span className="text-[11.5px] font-extrabold tracking-wider text-muted uppercase">Pricing</span>
      </div>
      <h2 className="relative z-10 font-display text-[34px] font-extrabold tracking-tight text-text">
        Pick the plan that fits your business
      </h2>
      <p className="relative z-10 mx-auto mt-3.5 mb-7 max-w-md text-[15px] leading-relaxed text-muted">
        Every feature above is free today. Pro adds team collaboration when it launches.
      </p>

      <div className="relative z-10 mb-10 inline-flex items-center gap-1 rounded-full border border-border bg-card p-1">
        <button
          type="button"
          onClick={() => setYearly(false)}
          className={cn(
            "rounded-full px-4.5 py-2.5 text-[13px] font-bold",
            !yearly ? "bg-accent-gradient text-white" : "text-muted"
          )}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setYearly(true)}
          className={cn(
            "rounded-full px-4.5 py-2.5 text-[13px] font-bold",
            yearly ? "bg-accent-gradient text-white" : "text-muted"
          )}
        >
          Yearly
        </button>
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-4.5 text-left sm:grid-cols-2">
        <div className="rounded-[20px] border border-border bg-card p-6.5">
          <p className="mb-1.5 text-[15px] font-bold text-text">Free</p>
          <p className="mb-4.5 flex items-baseline gap-1">
            <span className="font-display text-[32px] font-extrabold text-text">$0</span>
            <span className="text-[13px] text-muted">/ month</span>
          </p>
          <div className="mb-5.5 flex flex-col gap-2.5">
            {FREE_FEATURES.map((feat) => (
              <div key={feat} className="flex items-center gap-2.5 text-[13px] text-text">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {feat}
              </div>
            ))}
          </div>
          <a
            href="/login?mode=signup"
            className="block w-full rounded-[11px] border border-border bg-input-bg py-2.5 text-center text-[13.5px] font-bold text-text"
          >
            Get Started
          </a>
        </div>

        <div
          className="relative rounded-[20px] border p-6.5 shadow-[0_20px_50px_-20px_rgba(139,124,246,0.5)]"
          style={{ background: "linear-gradient(160deg, #241f3d, #17151f)", borderColor: "rgba(139,124,246,0.4)" }}
        >
          <span className="absolute top-5 right-5 rounded-full bg-white/15 px-2.5 py-1 text-[10.5px] font-extrabold tracking-wide text-white uppercase">
            Coming Soon
          </span>
          <p className="mb-1.5 text-[15px] font-bold text-white">Pro</p>
          <p className="mb-4.5 flex items-baseline gap-1">
            <span className="font-display text-[32px] font-extrabold text-white">
              {yearly ? "$15" : "$19"}
            </span>
            <span className="text-[13px] text-white/60">
              {yearly ? "/ month, billed yearly" : "/ month"}
            </span>
          </p>
          <div className="mb-5.5 flex flex-col gap-2.5">
            {PRO_FEATURES.map((feat) => (
              <div key={feat} className="flex items-center gap-2.5 text-[13px] text-white">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "#B565E8" }} />
                {feat}
              </div>
            ))}
          </div>
          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-[11px] border border-white/15 bg-white/10 py-2.5 text-[13.5px] font-bold text-white/50"
          >
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
}
