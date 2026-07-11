import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-normal ease-soft-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:brightness-105",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-border bg-transparent text-foreground hover:bg-muted",
        ghost: "bg-transparent text-foreground hover:bg-muted",
        accent: "bg-accent text-accent-foreground shadow-sm hover:shadow-md hover:brightness-105",
        cta: "bg-primary text-primary-foreground shadow-glow hover:shadow-lg hover:brightness-105",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:brightness-105",
        link: "text-primary underline-offset-4 hover:underline rounded-none px-0",
      },
      size: {
        sm: "h-10 px-4 text-body-sm",
        md: "h-11 px-6 text-body",
        lg: "h-12 px-8 text-body-lg",
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
