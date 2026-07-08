import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="mt-28 border-t border-border px-6 pt-12 pb-7">
      <div className="mx-auto mb-9 flex max-w-5xl flex-wrap justify-between gap-10">
        <div className="max-w-[280px]">
          <div className="mb-3.5 flex items-center gap-2.5">
            <Logo size="sm" />
            <span className="text-[16.5px] font-extrabold text-text">Invoera</span>
          </div>
          <p className="text-[13px] leading-relaxed text-muted">
            Invoicing and expenses, handled by AI.
          </p>
        </div>

        <div className="flex flex-wrap gap-14">
          <div>
            <p className="mb-3.5 text-xs font-bold tracking-wide text-muted uppercase">Product</p>
            <div className="flex flex-col gap-2.5">
              <a href="#features" className="text-[13.5px] text-text">
                Features
              </a>
              <a href="#pricing" className="text-[13.5px] text-text">
                Pricing
              </a>
              <a href="#dashboard-preview" className="text-[13.5px] text-text">
                Dashboard
              </a>
            </div>
          </div>
          <div>
            <p className="mb-3.5 text-xs font-bold tracking-wide text-muted uppercase">Company</p>
            <div className="flex flex-col gap-2.5">
              <a href="mailto:support@invoera.app" className="text-[13.5px] text-text">
                Contact
              </a>
            </div>
          </div>
          <div>
            <p className="mb-3.5 text-xs font-bold tracking-wide text-muted uppercase">Legal</p>
            <div className="flex flex-col gap-2.5">
              <Link href="/privacy" className="text-[13.5px] text-text">
                Privacy
              </Link>
              <Link href="/terms" className="text-[13.5px] text-text">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
      <p className="mx-auto max-w-5xl border-t border-border pt-5 text-xs text-muted">
        © 2026 Invoera. All rights reserved.
      </p>
    </footer>
  );
}
