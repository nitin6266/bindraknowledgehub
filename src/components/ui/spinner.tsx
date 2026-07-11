import * as React from "react";
import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  /** Diameter token. */
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizeMap = { sm: "1rem", md: "1.25rem", lg: "1.75rem" } as const;

/** Accessible loading spinner. Announces via `role="status"` + label. */
export function Spinner({ size = "md", label = "Loading", className, ...props }: SpinnerProps) {
  return (
    <svg
      role="status"
      aria-label={label}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("animate-spin", className)}
      style={{ width: sizeMap[size], height: sizeMap[size] }}
      {...props}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
