import { Badge } from "@/components/ui/badge";
import type { LeaveStatusValue } from "@/features/parent/parent.types";

const CONFIG: Record<LeaveStatusValue, { className: string; label: string }> = {
  PENDING: { className: "border-warning/30 bg-warning/15 text-warning", label: "Pending" },
  APPROVED: { className: "border-transparent bg-success/15 text-success", label: "Approved" },
  REJECTED: { className: "border-danger/30 bg-danger/15 text-danger", label: "Rejected" },
  CANCELLED: { className: "border-border bg-muted/50 text-muted-foreground", label: "Cancelled" },
};

export function LeaveStatusBadge({ status }: { status: LeaveStatusValue }) {
  const cfg = CONFIG[status];
  return (
    <Badge variant="outline" className={cfg.className}>
      {cfg.label}
    </Badge>
  );
}
