import { KpiChip } from "@/components/ui/kpi-chip";

interface KpiItem {
  label: string;
  value: string | number;
  trend?: { value: number; label: string };
  tone?: "primary" | "success" | "warning" | "accent";
}

interface KpiStripProps {
  items: KpiItem[];
}

export function KpiStrip({ items }: KpiStripProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <div key={item.label} className="flex-1 min-w-[140px]">
          <KpiChip label={item.label} value={item.value} trend={item.trend} tone={item.tone} />
        </div>
      ))}
    </div>
  );
}
