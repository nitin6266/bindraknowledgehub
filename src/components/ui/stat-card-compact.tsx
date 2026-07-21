"use client";

import { cn } from "@/lib/utils";

interface StatCardCompactProps {
  label: string;
  value: string | number;
  tone?: "primary" | "success" | "warning" | "accent";
  trend?: { value: number; label: string };
}

const TONES: Record<string, string> = {
  primary: "text-primary bg-primary/10",
  success: "text-success bg-success/10",
  warning: "text-warning bg-warning/10",
  accent: "text-accent bg-accent/10",
};

export function StatCardCompact({ label, value, tone = "primary", trend }: StatCardCompactProps) {
  return (
    <div className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl bg-card border border-border", "h-16 min-w-0")}>
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", TONES[tone])}>
        <span className="text-[11px] font-semibold uppercase tracking-wider">{label.charAt(0)}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-h4 font-semibold leading-none text-foreground truncate">{value}</p>
        <p className="mt-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider truncate">{label}</p>
        {trend && (
          <p className="mt-1 text-[10px] font-medium flex items-center gap-1">
            <span className={cn(trend.value >= 0 ? "text-success" : "text-destructive")}>
              {trend.value >= 0 ? "▲" : "▼"} {Math.abs(trend.value)}%
            </span>
            <span className="text-muted-foreground">{trend.label}</span>
          </p>
        )}
      </div>
    </div>
  );
}