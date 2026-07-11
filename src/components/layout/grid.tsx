import * as React from "react";
import { cn } from "@/lib/utils";

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
}

const colMap = { 1: "grid-cols-1", 2: "sm:grid-cols-2", 3: "md:grid-cols-3", 4: "lg:grid-cols-4" } as const;
const gapMap = { sm: "gap-4", md: "gap-6", lg: "gap-8" } as const;

/** Responsive auto-collapsing grid (mobile-first single column). */
export function Grid({ className, cols = 3, gap = "md", ...props }: GridProps) {
  return <div className={cn("grid", colMap[cols], gapMap[gap], className)} {...props} />;
}
