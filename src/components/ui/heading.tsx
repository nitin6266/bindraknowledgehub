import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva("font-heading font-semibold tracking-tight text-foreground", {
  variants: {
    size: {
      display: "text-display-md lg:text-display-lg",
      xl: "text-display-md",
      lg: "text-heading-lg",
      md: "text-heading-md",
      sm: "text-heading-sm",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      accent: "text-accent-foreground",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    size: "lg",
    tone: "default",
    align: "left",
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  /** Rendered semantic tag; defaults to h2 for accessible document outline. */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

/**
 * Typographic heading primitive. Pairs a semantic tag with the
 * design-system type scale. Never conveys meaning by size alone.
 */
const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size, tone, align, as: Comp = "h2", ...props }, ref) => (
    <Comp ref={ref} className={cn(headingVariants({ size, tone, align }), className)} {...props} />
  ),
);
Heading.displayName = "Heading";

export { Heading, headingVariants };
