interface Metric {
  label: string;
  value: string | number;
  color?: "primary" | "success" | "warning" | "muted";
}

interface MetricLineProps {
  metrics: Metric[];
}

const COLORS: Record<string, string> = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  muted: "text-muted-foreground",
};

export function MetricLine({ metrics }: MetricLineProps) {
  return (
    <p className="text-[13px] text-muted-foreground tabular-nums tracking-tight">
      {metrics.map((m, i) => (
        <span key={m.label}>
          <span className={COLORS[m.color ?? "muted"]}>{m.value}</span>
          <span className="text-muted-foreground/60"> {m.label}</span>
          {i < metrics.length - 1 && <span className="mx-2 text-border">·</span>}
        </span>
      ))}
    </p>
  );
}
