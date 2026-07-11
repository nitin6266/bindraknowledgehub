import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iconWrapperVariants = cva(
  "inline-flex items-center justify-center rounded-md bg-primary/10 text-primary",
  {
    variants: {
      size: {
        sm: "h-9 w-9 [&_svg]:size-4",
        md: "h-12 w-12 [&_svg]:size-5",
        lg: "h-16 w-16 [&_svg]:size-7",
      },
      variant: {
        primary: "bg-primary/10 text-primary",
        accent: "bg-accent/15 text-accent-foreground",
        soft: "bg-muted text-foreground",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "primary",
    },
  },
);

export interface IconWrapperProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof iconWrapperVariants> {}

/**
 * Decorative icon container that standardizes icon sizing and tinting.
 * Pass any Lucide icon as `children`. Mark `aria-hidden` by the caller
 * when purely decorative.
 */
const IconWrapper = React.forwardRef<HTMLSpanElement, IconWrapperProps>(
  ({ className, size, variant, ...props }, ref) => (
    <span ref={ref} className={cn(iconWrapperVariants({ size, variant }), className)} {...props} />
  ),
);
IconWrapper.displayName = "IconWrapper";

export { IconWrapper, iconWrapperVariants };
