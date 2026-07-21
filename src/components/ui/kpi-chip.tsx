import { cn } from "@/lib/utils";

interface KpiChipProps {
  label: string;
  value: string | number;
  trend?: { value: number; label: string };
  tone?: "primary" | "success" | "warning" | "accent";
}

const TONES: Record<string, string> = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  accent: "text-accent-foreground",
};

const DOT_TONES: Record<string, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  accent: "bg-accent-foreground",
};

export function KpiChip({ label, value, trend, tone = "primary" }: KpiChipProps) {
  return (
    <div className="flex items-center gap-3 min-h-[60px] px-4 py-3 rounded-xl bg-card border border-border">
      <span className={cn("flex size-2 shrink-0 rounded-full", DOT_TONES[tone])} aria-hidden />
      <div className="min-w-0">
        <p className="text-h4 font-semibold leading-none text-foreground tabular-nums">{value}</p>
        <p className="mt-0.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        {trend && (
          <p className="mt-1 text-[11px] flex items-center gap-1">
            <span className={trend.value >= 0 ? "text-success" : "text-destructive"}>
              {trend.value >= 0 ? "▲" : "▼"} {Math.abs(trend.value)}%
            </span>
            <span className="text-muted-foreground">{trend.label}</span>
          </p>
        )}
      </div>
    </div>
  );
}
