import { cn } from "@/lib/utils";

interface AppLoadingProps {
  className?: string;
  variant?: "page" | "list" | "card";
}

export function AppLoading({ className, variant = "page" }: AppLoadingProps) {
  if (variant === "list") {
    return (
      <div className={cn("space-y-3", className)} aria-busy="true" aria-label="Loading">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-xl border border-border bg-muted/50" />
        ))}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)} aria-busy="true" aria-label="Loading">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl border border-border bg-muted/50" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)} aria-busy="true" aria-label="Loading">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-muted/60" />
      <div className="h-4 w-72 animate-pulse rounded-lg bg-muted/40" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl border border-border bg-muted/50" />
        ))}
      </div>
    </div>
  );
}
