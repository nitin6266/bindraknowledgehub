"use client";

import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrolled } from "@/hooks/useScrolled";

/**
 * Floating "back to top" control. Appears after the user scrolls past the
 * hero, sits above the mobile sticky CTA, and is keyboard reachable with a
 * descriptive aria-label. Smooth scroll respects reduced-motion via tokens.
 */
export function BackToTop() {
  const show = useScrolled(480);

  const handleClick = () => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
      className={cn(
        "fixed bottom-20 right-4 z-30 grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-md transition-all duration-normal ease-soft-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:bottom-6",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <ArrowUp aria-hidden="true" className="size-5" />
    </button>
  );
}
