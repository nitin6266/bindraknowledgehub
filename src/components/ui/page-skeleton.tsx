import * as React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface PageSkeletonProps {
  className?: string;
  /** Number of KPI cards to render. */
  cards?: number;
  /** Number of table rows to render. */
  rows?: number;
  /** Show a second-level workspace tab row. */
  tabs?: boolean;
  /** Show a filter/toolbar row. */
  toolbar?: boolean;
}

/**
 * Consistent page-level loading skeleton shown by Next.js loading.tsx files.
 * Mirrors the real page structure (title → toolbar → KPIs → table) so the
 * layout does not shift when data arrives. Follows the design system.
 */
export function PageSkeleton({
  className,
  cards = 4,
  rows = 8,
  tabs = false,
  toolbar = true,
}: PageSkeletonProps) {
  return (
    <div className={cn("space-y-6", className)} aria-busy="true" aria-label="Loading">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {tabs && (
        <div className="flex gap-2 border-b border-border pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24" />
          ))}
        </div>
      )}

      {toolbar && (
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="ml-auto h-10 w-32" />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-lg border border-border bg-card p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>

      <div className="space-y-2 rounded-lg border border-border bg-card p-4">
        <Skeleton className="h-5 w-40" />
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
