import { Badge } from "@/components/ui/badge";

const CONFIG: Record<string, { className: string; label: string }> = {
  PENDING: { className: "border-warning/30 bg-warning/15 text-warning", label: "Pending" },
  PARTIAL: { className: "border-info/30 bg-info/10 text-info", label: "Partial" },
  PAID: { className: "border-transparent bg-success/15 text-success", label: "Paid" },
  OVERDUE: { className: "border-danger/30 bg-danger/15 text-danger", label: "Overdue" },
  WAIVED: { className: "border-transparent bg-muted/50 text-muted-foreground", label: "Waived" },
};

export function FeeStatusBadge({ status }: { status: string }) {
  const cfg = CONFIG[status] ?? { className: "border-border bg-muted/50 text-muted-foreground", label: status };
  return (
    <Badge variant="outline" className={cfg.className}>
      {cfg.label}
    </Badge>
  );
}
