import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, eyebrow, action }: PageHeaderProps) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            {eyebrow && (
              <span className="text-caption uppercase tracking-wider text-muted-foreground">{eyebrow}</span>
            )}
            <CardTitle className="text-h3 font-semibold">{title}</CardTitle>
            {description && (
              <CardDescription className="text-body text-muted-foreground">{description}</CardDescription>
            )}
          </div>
          {action && <div className="mt-2 sm:mt-0">{action}</div>}
        </div>
      </CardHeader>
    </Card>
  );
}