import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

/** Accessible checkbox (native input, brand-accented, large hit area). */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;
    return (
      <label htmlFor={inputId} className="inline-flex cursor-pointer items-center gap-2 text-body-sm">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className={cn(
            "h-5 w-5 rounded border-border accent-[hsl(var(--primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            className,
          )}
          {...props}
        />
        {label ? <span>{label}</span> : null}
      </label>
    );
  },
);
Checkbox.displayName = "Checkbox";
