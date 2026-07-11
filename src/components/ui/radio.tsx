import * as React from "react";
import { cn } from "@/lib/utils";

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

/** Accessible radio (native input, brand-accented, large hit area). */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...props }, ref) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;
    return (
      <label htmlFor={inputId} className="inline-flex cursor-pointer items-center gap-2 text-body-sm">
        <input
          ref={ref}
          id={inputId}
          type="radio"
          className={cn(
            "h-5 w-5 border-border accent-[hsl(var(--primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            className,
          )}
          {...props}
        />
        {label ? <span>{label}</span> : null}
      </label>
    );
  },
);
Radio.displayName = "Radio";
