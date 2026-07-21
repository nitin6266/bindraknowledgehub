import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { fieldBase } from "@/components/ui/input";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  onValueChange?: (value: string) => void;
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, onValueChange, onChange, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(fieldBase, "h-11 appearance-none pr-10", className)}
        onChange={(e) => {
          onChange?.(e);
          onValueChange?.(e.target.value);
        }}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  ),
);
Select.displayName = "Select";

// ─── Shadcn-style sub-components for native select compatibility ───────────
// These are passthrough components so code using the shadcn Select API
// (SelectTrigger, SelectValue, SelectContent, SelectItem) can work with
// a native <select> element underneath.

/** Wraps SelectValue. Renders children directly (typically a SelectValue). */
export function SelectTrigger({ children }: { children?: React.ReactNode; [key: string]: any }) {
  return <>{children}</>;
}

/** Renders a disabled placeholder option when no value is selected, or shows the placeholder text. */
export function SelectValue({ placeholder }: { placeholder?: string; [key: string]: any }) {
  return <option value="" disabled>{placeholder ?? "Select..."}</option>;
}

/** Wraps a list of SelectItem elements. Renders children directly. */
export function SelectContent({ children }: { children?: React.ReactNode; [key: string]: any }) {
  return <>{children}</>;
}

/** Renders an <option> element. */
export function SelectItem({ value, children, className }: { value: string; children?: React.ReactNode; className?: string; [key: string]: any }) {
  return <option value={value} className={className}>{children}</option>;
}
