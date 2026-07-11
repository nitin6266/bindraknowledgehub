import * as React from "react";
import { cn } from "@/lib/utils";

export interface HighlightTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual style of the highlight. */
  variant?: "accent" | "primary" | "muted";
}

/** Inline highlighted phrase (e.g. a key value word inside a heading). */
export function HighlightText({ className, variant = "accent", ...props }: HighlightTextProps) {
  return (
    <span
      className={cn(
        "rounded-md px-1.5 py-0.5 font-semibold",
        variant === "accent" && "bg-accent/20 text-accent-foreground",
        variant === "primary" && "bg-primary/15 text-primary",
        variant === "muted" && "bg-muted text-foreground",
        className,
      )}
      {...props}
    />
  );
}
