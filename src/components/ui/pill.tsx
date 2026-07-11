import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pillVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-body-xs font-medium",
  {
    variants: {
      variant: {
        neutral: "bg-muted text-muted-foreground",
        primary: "bg-primary/10 text-primary",
        accent: "bg-accent/15 text-accent-foreground",
        success: "bg-success/15 text-success",
        warning: "bg-warning/15 text-warning-foreground",
        danger: "bg-danger/15 text-danger",
      },
      dot: { true: "", false: "" },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export interface PillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof pillVariants> {
  /** Renders a small status dot before the label. */
  showDot?: boolean;
}

/** Compact status pill (e.g. course level, enrollment status). */
export function Pill({ className, variant, showDot, children, ...props }: PillProps) {
  return (
    <span className={cn(pillVariants({ variant }), className)} {...props}>
      {showDot ? <span className="size-1.5 rounded-full bg-current" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
