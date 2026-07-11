"use client";

import * as React from "react";
import { Cookie, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "bkh-cookie-consent";

/**
 * Placeholder cookie consent banner (foundation only — no real consent
 * wiring yet). Minimal, dismissible, and remembered via localStorage. The
 * accept/dismiss handlers are stubs to be connected to a real CMP later.
 */
export function CookieConsent() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const decided = localStorage.getItem(STORAGE_KEY);
    if (!decided) setOpen(true);
  }, []);

  const dismiss = React.useCallback((choice: "accepted" | "dismissed") => {
    localStorage.setItem(STORAGE_KEY, choice);
    setOpen(false);
  }, []);

  if (!open) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className={cn(
        "fixed inset-x-3 bottom-20 z-30 sm:inset-x-auto sm:right-4 sm:bottom-6 sm:max-w-sm",
        "rounded-xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary"
        >
          <Cookie className="size-5" />
        </span>

        <div className="flex-1">
          <p className="text-body-sm font-semibold text-foreground">We value your privacy</p>
          <p className="mt-1 text-body-sm text-muted-foreground">
            We use cookies to improve your experience. This is a placeholder banner — full consent
            management arrives soon.
          </p>

          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="cta" onClick={() => dismiss("accepted")}>
              Accept
            </Button>
            <Button size="sm" variant="outline" onClick={() => dismiss("dismissed")}>
              Decline
            </Button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => dismiss("dismissed")}
          aria-label="Dismiss cookie notice"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>
    </div>
  );
}
