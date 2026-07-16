"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Global top progress bar for route transitions.
 *
 * Shows an immediately-visible indicator (within ~100ms) whenever the path
 * or search params change, giving the user feedback that navigation is in
 * progress before the destination route finishes loading. The bar is
 * decorative only and never blocks interaction.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const key = `${pathname}?${searchParams?.toString() ?? ""}`;

  const [visible, setVisible] = React.useState(false);
  const [complete, setComplete] = React.useState(true);
  const firstRender = React.useRef(true);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    // Show feedback immediately (well under 100ms).
    setVisible(true);
    setComplete(false);

    // Auto-complete once the new route has rendered.
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setComplete(true);
      // Hide after the exit transition finishes.
      const hide = setTimeout(() => setVisible(false), 200);
      timer.current = hide;
    }, 350);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [key]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5"
      role="progressbar"
      aria-label="Loading"
      aria-busy="true"
    >
      <div
        className="h-full bg-primary transition-[width,opacity] duration-200 ease-standard"
        style={{
          width: complete ? "100%" : "35%",
          opacity: complete ? 0 : 1,
        }}
      />
    </div>
  );
}
