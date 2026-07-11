import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const labelVariants = cva(
  "font-medium uppercase tracking-wide text-muted-foreground",
  {
    variants: {
      size: {
        sm: "text-body-xs",
        md: "text-body-sm",
        lg: "text-body",
      },
      tone: {
        default: "text-muted-foreground",
        primary: "text-primary",
        accent: "text-accent-foreground",
      },
    },
    defaultVariants: {
      size: "sm",
      tone: "default",
    },
  },
);

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {}

/**
 * Form / section label primitive. Renders a real <label> when `htmlFor` is
 * set (associating it with a control); otherwise renders a <span> for
 * presentational labels. Uppercase tracking keeps it scannable.
 */
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, size, tone, htmlFor, ...props }, ref) => {
    const Comp = htmlFor ? "label" : "span";
    return (
      <Comp
        ref={ref}
        htmlFor={htmlFor}
        className={cn(
          labelVariants({ size, tone }),
          htmlFor ? "cursor-pointer" : "",
          className,
        )}
        {...props}
      />
    );
  },
);
Label.displayName = "Label";

export { Label, labelVariants };
