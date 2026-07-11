import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-body-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/10 text-primary",
        accent: "border-transparent bg-accent/15 text-accent-foreground",
        outline: "border-border text-muted-foreground",
        success: "border-transparent bg-success/15 text-success",
        warning: "border-transparent bg-warning/15 text-warning-foreground",
        danger: "border-transparent bg-danger/15 text-danger",
      },
      selected: {
        true: "ring-2 ring-ring ring-offset-2 ring-offset-background",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      selected: false,
    },
  },
);

export interface ChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {
  /** Optional leading icon (e.g. a small lucide icon). Hidden from a11y tree. */
  icon?: React.ReactNode;
  /** When set, renders a dismiss (×) button with the given label. */
  onDismiss?: () => void;
  /** Accessible label for the dismiss button. Required when `onDismiss` is set. */
  dismissLabel?: string;
}

/**
 * Compact, optionally interactive chip. Use for filters, tags and selections.
 * Unlike the static Pill, a Chip can carry an icon and a dismiss control.
 * The dismiss button is keyboard reachable and announced via `aria-label`.
 */
const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  ({ className, variant, selected, icon, onDismiss, dismissLabel, children, ...props }, ref) => (
    <span ref={ref} className={cn(chipVariants({ variant, selected }), className)} {...props}>
      {icon ? (
        <span aria-hidden="true" className="inline-flex size-3.5 items-center justify-center [&_svg]:size-3.5">
          {icon}
        </span>
      ) : null}
      {children}
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel ?? "Remove"}
          className="-mr-1 ml-0.5 inline-flex size-4 items-center justify-center rounded-full text-current/70 transition-colors hover:bg-current/10 hover:text-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="size-3" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      ) : null}
    </span>
  ),
);
Chip.displayName = "Chip";

export { Chip, chipVariants };
