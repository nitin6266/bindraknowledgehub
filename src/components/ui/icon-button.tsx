import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-foreground transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        ghost: "hover:bg-muted",
        outline: "border border-border hover:bg-muted",
        solid: "bg-primary text-primary-foreground hover:brightness-105",
        subtle: "bg-muted text-foreground hover:bg-muted/70",
      },
      size: {
        sm: "h-9 w-9 [&_svg]:size-4",
        md: "h-11 w-11 [&_svg]:size-5",
        lg: "h-12 w-12 [&_svg]:size-6",
      },
    },
    defaultVariants: { variant: "ghost", size: "md" },
  },
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  asChild?: boolean;
  /** Required for accessibility — icon-only buttons need a label. */
  "aria-label": string;
}

/** Square, icon-only button with a mandatory accessible label. */
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp ref={ref} className={cn(iconButtonVariants({ variant, size, className }))} {...props} />
    );
  },
);
IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
