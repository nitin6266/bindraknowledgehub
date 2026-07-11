import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const captionVariants = cva("text-body-xs leading-normal", {
  variants: {
    tone: {
      muted: "text-muted-foreground",
      default: "text-foreground",
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
    tone: "muted",
    align: "left",
  },
});

export interface CaptionProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof captionVariants> {}

/** Small, supporting caption text (metadata, footnotes, image credits). */
const Caption = React.forwardRef<HTMLParagraphElement, CaptionProps>(
  ({ className, tone, align, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(captionVariants({ tone, align }), className)}
      {...props}
    />
  ),
);
Caption.displayName = "Caption";

export { Caption, captionVariants };
