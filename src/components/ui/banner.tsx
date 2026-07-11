import * as React from "react";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const bannerVariants = cva("relative w-full rounded-lg border p-4 text-body-sm", {
  variants: {
    variant: {
      success: "border-success/30 bg-success/10 text-success",
      error: "border-danger/30 bg-danger/10 text-danger",
      warning: "border-warning/30 bg-warning/10 text-warning-foreground",
      info: "border-info/30 bg-info/10 text-info-foreground",
    },
  },
  defaultVariants: { variant: "info" },
});

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
} as const;

export interface BannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bannerVariants> {
  title?: string;
  description?: string;
  /** Show a dismiss button (caller controls visibility). */
  onDismiss?: () => void;
}

/** Status banner for success / error / warning / info feedback. */
export function Banner({ variant, title, description, onDismiss, className, children, ...props }: BannerProps) {
  const Icon = icons[variant ?? "info"];
  return (
    <div role="status" className={cn(bannerVariants({ variant }), className)} {...props}>
      <div className="flex items-start gap-3">
        <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
        <div className="flex-1">
          {title ? <p className="font-semibold">{title}</p> : null}
          {description ? <p className="mt-1 opacity-90">{description}</p> : null}
          {children}
        </div>
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
