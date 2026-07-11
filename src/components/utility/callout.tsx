import * as React from "react";
import { Info, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const calloutVariants = cva("flex gap-3 rounded-lg border p-4 text-body-sm", {
  variants: {
    variant: {
      info: "border-info/30 bg-info/10 text-foreground",
      warning: "border-warning/30 bg-warning/10 text-foreground",
      success: "border-success/30 bg-success/10 text-foreground",
      danger: "border-danger/30 bg-danger/10 text-foreground",
    },
  },
  defaultVariants: { variant: "info" },
});

const icons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle2,
  danger: XCircle,
} as const;

export interface CalloutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calloutVariants> {
  title?: string;
}

/** Compact inline note (distinct from Banner — sits inside content flow). */
export function Callout({ variant, title, className, children, ...props }: CalloutProps) {
  const Icon = icons[variant ?? "info"];
  return (
    <div className={cn(calloutVariants({ variant }), className)} {...props}>
      <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-current" />
      <div>
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className="mt-1 opacity-90">{children}</div> : null}
      </div>
    </div>
  );
}
