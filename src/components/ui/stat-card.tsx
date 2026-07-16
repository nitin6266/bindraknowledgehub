import { Card, CardContent } from "@/components/ui/card";
import { IconWrapper } from "@/components/ui/icon-wrapper";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  tone?: "primary" | "success" | "warning" | "danger" | "accent";
}

const TONES: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  accent: "bg-accent/15 text-accent-foreground",
};

export function StatCard({ label, value, icon, tone = "primary" }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <IconWrapper className={cn("size-10 shrink-0", TONES[tone])}>{icon}</IconWrapper>
        <div className="min-w-0">
          <p className="text-h4 font-semibold leading-none text-foreground">{value}</p>
          <p className="mt-1 truncate text-body-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
