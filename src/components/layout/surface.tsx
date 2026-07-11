import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const surfaceVariants = cva("rounded-lg", {
  variants: {
    tone: {
      surface: "bg-surface",
      card: "bg-card text-card-foreground",
      muted: "bg-muted",
      transparent: "bg-transparent",
    },
    border: { true: "border border-border", false: "" },
    shadow: {
      none: "",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
      glass: "shadow-glass backdrop-blur supports-[backdrop-filter]:bg-background/70",
    },
    radius: {
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
    },
  },
  defaultVariants: { tone: "card", border: true, shadow: "sm", radius: "lg" },
});

export interface SurfaceProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof surfaceVariants> {}

/** Elevated panel primitive used by cards, banners and sections. */
export function Surface({ className, tone, border, shadow, radius, ...props }: SurfaceProps) {
  return <div className={cn(surfaceVariants({ tone, border, shadow, radius }), className)} {...props} />;
}
