import type { ReactNode } from "react";

/**
 * Shared two-layer background (image + theme scrim) used behind the
 * Dashboard, Clients, Client Detail, Expenses, and Settings pages. The
 * layers are viewport-fixed (not scoped to this component's own box) so the
 * image covers the entire page edge-to-edge regardless of the content
 * column's padding/max-width, or how tall the page's own content is.
 * Children render on top via a relative/z-10 stacking context.
 */
export function PageBackground({
  children,
  image = "/images/pages-bg.webp",
}: {
  children: ReactNode;
  image?: string;
}) {
  return (
    <div className="relative flex flex-1 flex-col">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden="true"
      />
      <div className="fixed inset-0 -z-10 bg-bg opacity-80 dark:opacity-55" aria-hidden="true" />
      <div className="relative z-10 flex-1">{children}</div>
    </div>
  );
}
