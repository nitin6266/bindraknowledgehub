import Link from "next/link";
import { CalendarCheck, CalendarDays, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";

interface SectionCardProps {
  title: string;
  actionHref?: string;
  actionLabel?: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ title, actionHref, actionLabel, children, className }: SectionCardProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
        <CardTitle className="text-heading-sm">{title}</CardTitle>
        {actionHref && actionLabel && (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-0.5 text-body-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            {actionLabel}
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

const KPI_TONES = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  accent: "bg-accent/15 text-accent-foreground",
} as const;

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  tone?: keyof typeof KPI_TONES;
  href?: string;
}

export function KpiCard({ label, value, icon, tone = "primary", href }: KpiCardProps) {
  const inner = (
    <Card className="h-full transition-colors hover:border-primary/40">
      <CardContent className="flex items-center gap-3 p-4">
        <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", KPI_TONES[tone])}>
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-h4 font-semibold leading-none text-foreground">{value}</p>
          <p className="mt-1 truncate text-body-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {inner}
      </Link>
    );
  }
  return inner;
}

interface QuickAction {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {actions.map((a) => (
        <Link
          key={a.href}
          href={a.href}
          className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card p-5 text-center shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
            {a.icon}
          </span>
          <span className="text-body-sm font-medium text-foreground">{a.label}</span>
        </Link>
      ))}
    </div>
  );
}

interface DeptShortcut {
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

export function DepartmentShortcuts({ items }: { items: DeptShortcut[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {item.icon}
          </span>
          <div className="min-w-0">
            <p className="font-heading text-body font-semibold text-foreground">{item.label}</p>
            <p className="mt-0.5 truncate text-body-sm text-muted-foreground">{item.description}</p>
          </div>
          <ChevronRight className="ml-auto h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </Link>
      ))}
    </div>
  );
}

export function ActivityTimeline({ items }: { items: { id: string; type: string; title: string; detail: string; date: Date }[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<CalendarCheck className="h-8 w-8" />}
        title="No recent activity"
        description="Admissions, attendance and payments will appear here as they happen."
      />
    );
  }

  const toneByType: Record<string, string> = {
    admission: "bg-success/15 text-success",
    attendance: "bg-primary/10 text-primary",
    payment: "bg-accent/15 text-accent-foreground",
    assignment: "bg-warning/15 text-warning",
    test: "bg-danger/15 text-danger",
  };

  return (
    <ul role="list" className="space-y-4">
      {items.map((item) => (
        <li key={item.id} className="flex gap-3">
          <span className={cn("mt-1 flex size-8 shrink-0 items-center justify-center rounded-full", toneByType[item.type] ?? "bg-muted text-muted-foreground")}>
            <span className="h-2 w-2 rounded-full bg-current" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-body-sm font-medium text-foreground">{item.title}</p>
            <p className="truncate text-body-sm text-muted-foreground">{item.detail}</p>
            <p className="mt-0.5 text-body-xs text-muted-foreground">{formatDate(item.date)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

const EVENT_TONE: Record<string, "default" | "accent" | "success" | "outline"> = {
  HOLIDAY: "accent",
  EXAM: "outline",
  PARENT_MEETING: "success",
  RESULT: "default",
  WORKSHOP: "outline",
};

export function EventList({ items }: { items: { id: string; title: string; date: Date; type: string }[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<CalendarDays className="h-8 w-8" />}
        title="No upcoming events"
        description="Holidays, exams and meetings scheduled in the calendar will appear here."
      />
    );
  }

  return (
    <ul role="list" className="space-y-3">
      {items.map((event) => (
        <li key={event.id} className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
          <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 py-1.5 text-primary">
            <span className="text-body-xs font-medium uppercase">{event.date.toLocaleString("en-IN", { month: "short" })}</span>
            <span className="text-h4 font-semibold leading-none">{event.date.getDate()}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-body-sm font-medium text-foreground">{event.title}</p>
            <p className="text-body-xs capitalize text-muted-foreground">{event.type.replace("_", " ").toLowerCase()}</p>
          </div>
          <Badge variant={EVENT_TONE[event.type] ?? "outline"}>{formatDay(event.date)}</Badge>
        </li>
      ))}
    </ul>
  );
}

function formatDate(d: Date): string {
  return d.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

function formatDay(d: Date): string {
  return d.toLocaleString("en-IN", { weekday: "short" });
}
