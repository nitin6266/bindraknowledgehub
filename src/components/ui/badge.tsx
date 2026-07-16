import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-body-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/10 text-primary",
        accent: "border-transparent bg-secondary text-foreground",
        outline: "border-border text-muted-foreground",
        success: "border-transparent bg-success/10 text-success",
        pending: "border-transparent bg-warning/15 text-warning",
        warning: "border-transparent bg-warning/15 text-warning",
        inactive: "border-transparent bg-secondary text-muted-foreground",
        error: "border-transparent bg-danger/10 text-danger",
        danger: "border-transparent bg-danger/10 text-danger",
        info: "border-transparent bg-info/10 text-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
