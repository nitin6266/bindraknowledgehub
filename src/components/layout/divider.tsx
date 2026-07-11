import * as React from "react";
import { cn } from "@/lib/utils";

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
  label?: string;
}

/** Accessible separator. With `label`, renders a semantic labeled rule. */
export function Divider({ className, orientation = "horizontal", label, ...props }: DividerProps) {
  if (label) {
    return (
      <div
        role="separator"
        aria-label={label}
        className={cn("flex items-center gap-4 text-body-xs text-muted-foreground", className)}
      >
        <span className="h-px flex-1 bg-border" />
        <span>{label}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
    );
  }
  return (
    <hr
      role="separator"
      aria-orientation={orientation}
      className={cn("border-0 bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className)}
      {...props}
    />
  );
}
