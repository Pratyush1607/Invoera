"use client";

import { useState } from "react";
import { SUPPORTED_CURRENCIES } from "@/lib/constants";

const FAQ_ITEMS = [
  {
    id: "q1",
    question: "How does the AI extraction work?",
    answer:
      "Upload a receipt or invoice and a multi-agent pipeline reads it, validates the details, and files it into the right category automatically.",
  },
  {
    id: "q2",
    question: "Can I invoice clients in different currencies?",
    answer: `Yes — invoices and expenses can be tracked in any of ${SUPPORTED_CURRENCIES.length} supported currencies, and your dashboard converts totals to your chosen display currency.`,
  },
  {
    id: "q3",
    question: "Is there a free plan?",
    answer: "Yes — every feature is free today, including unlimited clients and the full AI pipeline.",
  },
  {
    id: "q4",
    question: "When is the Pro plan launching?",
    answer:
      "Pro (team seats, custom branding) is still in planning. Join on the Free plan today and we'll let you know when it's available.",
  },
];

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>("q1");

  return (
    <div id="faq" className="mx-auto mt-28 max-w-3xl scroll-mt-24 px-6">
      <h2 className="mb-8 text-center font-display text-[30px] font-extrabold tracking-tight text-text">
        Frequently Asked Questions
      </h2>
      <div className="flex flex-col gap-2.5">
        {FAQ_ITEMS.map((item) => {
          const open = openId === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setOpenId(open ? null : item.id)}
              className="cursor-pointer rounded-[14px] border border-border bg-card px-5 py-4.5"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[14.5px] font-bold text-text">{item.question}</span>
                <span className="shrink-0 text-lg text-muted">{open ? "−" : "+"}</span>
              </div>
              {open && <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{item.answer}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
