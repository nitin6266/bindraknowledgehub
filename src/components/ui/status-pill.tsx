import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-success/10 text-success border-success/20",
  INACTIVE: "bg-muted text-muted-foreground border-border",
  LEFT: "bg-danger/10 text-danger border-danger/20",
  GRADUATED: "bg-info/10 text-info border-info/20",
  PENDING: "bg-warning/15 text-warning border-warning/20",
  NEW: "bg-primary/10 text-primary border-primary/20",
};

const STATUS_DOT: Record<string, string> = {
  ACTIVE: "bg-success",
  INACTIVE: "bg-muted-foreground",
  LEFT: "bg-danger",
  GRADUATED: "bg-info",
  PENDING: "bg-warning",
  NEW: "bg-primary",
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  LEFT: "Left",
  GRADUATED: "Graduated",
  PENDING: "Pending",
  NEW: "New",
};

interface StatusPillProps {
  status: string;
  label?: string;
  className?: string;
}

export function StatusPill({ status, label, className }: StatusPillProps) {
  const style = STATUS_STYLES[status] ?? "bg-muted text-muted-foreground border-border";
  const dot = STATUS_DOT[status] ?? "bg-muted-foreground";
  const displayLabel = label ?? STATUS_LABEL[status] ?? status;

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium", style, className)}>
      <span className={cn("size-1.5 rounded-full", dot)} aria-hidden />
      {displayLabel}
    </span>
  );
}
