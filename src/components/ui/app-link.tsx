"use client";

import * as React from "react";
import Link from "next/link";
import { useLinkStatus } from "next/link";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

interface AppLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  /** Show a small spinner inside the link while the route is pending. */
  showPendingSpinner?: boolean;
  /** Disable pointer events while the route is pending (prevents double clicks). */
  lockWhilePending?: boolean;
  className?: string;
}

/**
 * Drop-in replacement for next/link that surfaces navigation state.
 *
 * - Shows a spinner inside the link the moment a transition starts (instant
 *   feedback, well under 100ms).
 * - Optionally blocks pointer events while the route is pending to prevent
 *   repeated clicks / double navigation.
 *
 * The pending status is provided by Next.js `useLinkStatus`, which only works
 * inside the <Link> subtree, hence the inner component.
 */
export const AppLink = React.forwardRef<HTMLAnchorElement, AppLinkProps>(
  (
    { children, className, showPendingSpinner = true, lockWhilePending = true, ...props },
    ref,
  ) => {
    return (
      <Link ref={ref} className={className} {...props}>
        <AppLinkContent
          className={className}
          showPendingSpinner={showPendingSpinner}
          lockWhilePending={lockWhilePending}
        >
          {children}
        </AppLinkContent>
      </Link>
    );
  },
);
AppLink.displayName = "AppLink";

function AppLinkContent({
  children,
  className,
  showPendingSpinner,
  lockWhilePending,
}: {
  children: React.ReactNode;
  className?: string;
  showPendingSpinner: boolean;
  lockWhilePending: boolean;
}) {
  const { pending } = useLinkStatus();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2",
        pending && lockWhilePending && "pointer-events-none",
        className,
      )}
    >
      {children}
      {showPendingSpinner && pending && (
        <Spinner size="sm" className="text-current" label="Navigating" />
      )}
    </span>
  );
}
