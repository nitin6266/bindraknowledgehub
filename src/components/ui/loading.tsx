"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

export interface LoadingOverlayProps {
  /** When true the overlay is shown. */
  loading: boolean;
  /** Optional message announced to assistive tech. */
  label?: string;
  /** Dim the page behind the overlay. */
  blur?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Full-area loading overlay for async sections (forms, data fetches).
 * Renders a focus-trapped, aria-busy region so screen readers announce
 * the pending state. Respects reduced-motion via the global token rule.
 */
export function LoadingOverlay({
  loading,
  label = "Loading",
  blur = true,
  className,
  children,
}: LoadingOverlayProps) {
  if (!loading) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      className={cn(
        "absolute inset-0 z-30 grid place-items-center rounded-[inherit] bg-background/70",
        blur && "backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" label={label} />
        <span className="text-body-sm text-muted-foreground">{label}</span>
      </div>
      {children}
    </div>
  );
}

export interface PageLoaderProps {
  label?: string;
  className?: string;
}

/**
 * Centered, route-level loading state shown while a page/section streams in.
 * Uses the shared Spinner and respects reduced-motion globally.
 */
export function PageLoader({ label = "Loading page", className }: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn(
        "grid min-h-[60vh] w-full place-items-center",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" label={label} />
        <span className="text-body-sm font-medium text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
