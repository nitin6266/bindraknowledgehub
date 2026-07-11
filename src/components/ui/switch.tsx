import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  className?: string;
}

/** Accessible toggle switch (role="switch", keyboard + screen-reader ready). */
export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, defaultChecked, onCheckedChange, disabled, className, ...props }, ref) => {
    const [internal, setInternal] = React.useState(defaultChecked ?? false);
    const isControlled = checked !== undefined;
    const active = isControlled ? checked : internal;

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={active}
        aria-label={props["aria-label"]}
        aria-labelledby={props["aria-labelledby"]}
        disabled={disabled}
        onClick={() => {
          if (!isControlled) setInternal((v) => !v);
          onCheckedChange?.(!active);
        }}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50",
          active ? "bg-primary" : "bg-muted",
          className,
        )}
      >
        <span
          className={cn(
            "inline-block size-5 rounded-full bg-white shadow-sm transition-transform duration-fast",
            active ? "translate-x-[22px]" : "translate-x-0.5",
          )}
        />
      </button>
    );
  },
);
Switch.displayName = "Switch";
