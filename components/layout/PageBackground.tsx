import type { ReactNode } from "react";

/**
 * Shared radial-gradient "glow" background used behind the Dashboard,
 * Clients, Client Detail, Expenses, and Settings pages. Viewport-fixed (not
 * scoped to this component's own box) so it covers the entire page
 * edge-to-edge regardless of the content column's padding/max-width, or how
 * tall the page's own content is. Children render on top via a
 * relative/z-10 stacking context.
 */
export function PageBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col">
      <div className="fixed inset-0 -z-10 bg-hero-glow" aria-hidden="true" />
      <div className="relative z-10 min-w-0 flex-1">{children}</div>
    </div>
  );
}
