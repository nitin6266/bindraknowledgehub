import { cn } from "@/lib/utils";

interface AppEmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function AppEmptyState({ title, description, icon, action, className }: AppEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center",
        className,
      )}
    >
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <p className="font-heading text-heading-sm font-semibold text-card-foreground">{title}</p>
        {description && <p className="text-body text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
