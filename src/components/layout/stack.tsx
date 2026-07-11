import * as React from "react";
import { cn } from "@/lib/utils";

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between";
}

const gapMap = {
  xs: "gap-2",
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
} as const;
const alignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
} as const;
const justifyMap = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
} as const;

/** Vertical (or horizontal) flex stack with consistent spacing. */
export function Stack({
  className,
  gap = "md",
  align = "stretch",
  justify = "start",
  ...props
}: StackProps) {
  return (
    <div
      className={cn("flex flex-col", gapMap[gap], alignMap[align], justifyMap[justify], className)}
      {...props}
    />
  );
}
