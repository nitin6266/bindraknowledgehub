import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors duration-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))]",
        secondary: "border border-border bg-surface text-foreground hover:bg-secondary",
        outline: "border border-border bg-surface text-foreground hover:bg-secondary",
        ghost: "bg-transparent text-foreground hover:bg-secondary",
        accent: "bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))]",
        cta: "bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))]",
        destructive: "bg-danger text-danger-foreground hover:brightness-95",
        link: "text-primary underline-offset-4 hover:underline rounded-none px-0",
      },
      size: {
        sm: "h-9 px-3 text-body-sm",
        md: "h-11 px-4 text-body",
        lg: "h-12 px-6 text-body-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Shows a spinner and blocks interaction while true. */
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const classes = cn(buttonVariants({ variant, size, className }));

    if (asChild) {
      // Slot requires a single element child — never inject the spinner here.
      return (
        <Comp ref={ref} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
          {children}
        </Comp>
      );
    }

    return (
      <Comp ref={ref} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
        {loading ? <Spinner size="sm" /> : null}
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
