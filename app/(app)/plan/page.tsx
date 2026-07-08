import { Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const FREE_FEATURES = [
  "Unlimited AI-extracted invoices and receipts",
  "Multi-currency dashboard and reporting",
  "Email notifications",
];
const PRO_FEATURES = [
  "Multi-user access for teams",
  "Priority AI processing",
  "Priority support",
];

export default function PlanPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Plan &amp; Billing</h1>
        <p className="text-sm text-muted">
          Invoera is free for everyone right now — paid plans aren&apos;t open yet.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-text">Free</h3>
            <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
              Current plan
            </span>
          </div>
          <p className="mt-1 text-2xl font-bold text-text">
            $0<span className="text-sm font-medium text-muted"> / month</span>
          </p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {FREE_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-muted">
                <Check className="h-4 w-4 text-accent" />
                {feature}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-text">Pro</h3>
            <span className="rounded-full bg-warning/15 px-3 py-1 text-xs font-semibold text-warning">
              Coming soon
            </span>
          </div>
          <p className="mt-1 text-2xl font-bold text-text">
            TBD<span className="text-sm font-medium text-muted"> / month</span>
          </p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {PRO_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-muted">
                <Check className="h-4 w-4 text-accent" />
                {feature}
              </li>
            ))}
          </ul>
          <Button className="mt-6 w-full" disabled title="Pro plans aren't available yet">
            Coming soon
          </Button>
        </Card>
      </div>
    </div>
  );
}
