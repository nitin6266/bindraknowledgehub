import Link from "next/link";
import {
  CalendarClock,
  UserCheck,
  ClipboardList,
  CheckSquare,
  History,
  ArrowRight,
  Users,
  BookOpen,
  ClipboardCheck,
} from "lucide-react";

import { PageHeader } from "@/features/dashboard/components/page-header";
import { AppWorkspaceTabs } from "@/features/dashboard/shell/app-workspace-tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  getDashboardStats,
  getTodayClasses,
  listAssignments,
  listTests,
} from "@/features/teacher/actions/teacher.actions";
import type { TodayClass } from "@/features/teacher/teacher.types";

function greeting(date: Date): string {
  const h = date.getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function formatTime(range: string): string {
  return range;
}

export const dynamic = "force-dynamic";

export default async function TeacherDashboardPage() {
  const [statsRes, classesRes, assignmentsRes, testsRes] = await Promise.all([
    getDashboardStats(),
    getTodayClasses(),
    listAssignments({}),
    listTests({}),
  ]);

  const stats = statsRes.success ? statsRes.data : null;
  const classes = (classesRes.success ? classesRes.data : []) as TodayClass[];
  const assignments = assignmentsRes.success ? assignmentsRes.data : [];
  const tests = testsRes.success ? testsRes.data : [];

  const now = new Date();
  const dayName = now.toLocaleString("en-IN", { weekday: "long" });
  const dateLabel = now.toLocaleString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  const draftAssignments = assignments.filter((a) => a.status === "DRAFT");
  const publishedAssignments = assignments.filter((a) => a.status === "PUBLISHED");
  const toEvaluateTests = tests.filter((t) => t.status === "CONDUCTED" || t.status === "GRADED");
  const upcomingTests = tests.filter((t) => t.status === "SCHEDULED" || t.status === "DRAFT");

  const quickActions = [
    { label: "Take Attendance", href: "/dashboard/teacher/attendance", icon: ClipboardCheck },
    { label: "New Assignment", href: "/dashboard/teacher/assignments/new", icon: ClipboardList },
    { label: "New Test", href: "/dashboard/teacher/tests/new", icon: CheckSquare },
    { label: "My Classes", href: "/dashboard/teacher/batches", icon: Users },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Teacher"
        title="Teacher Dashboard"
        description="Your teaching day at a glance."
      />
      <AppWorkspaceTabs workspace="dashboard" />

      {/* Welcome */}
      <section className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-transparent p-6">
        <p className="text-body-sm font-medium text-primary">
          {greeting(now)}, Teacher
        </p>
        <h2 className="mt-1 font-heading text-heading-lg font-bold text-foreground">
          Here&apos;s your day
        </h2>
        <p className="mt-2 text-body text-muted-foreground">
          <span className="font-medium text-foreground">{dayName}</span>, {dateLabel}
        </p>
      </section>

      {/* Today's Classes */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-heading-sm font-semibold text-foreground">Today&apos;s Classes</h3>
          <Link href="/dashboard/teacher/attendance" className="inline-flex items-center gap-0.5 text-body-sm font-medium text-primary hover:underline">
            All attendance <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {classes.length === 0 ? (
          <EmptyState
            icon={<CalendarClock className="h-8 w-8" />}
            title="No classes scheduled today"
            description="Enjoy your free day, or prepare upcoming assignments and tests."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
              <Card key={cls.id} className="shadow-sm">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-heading text-body font-semibold text-foreground">{cls.batchName}</p>
                      <p className="text-body-sm text-muted-foreground">{cls.subjectName}</p>
                    </div>
                    <Badge variant={cls.attendanceStatus === "COMPLETED" ? "success" : "outline"}>
                      {cls.attendanceStatus === "COMPLETED" ? "Done" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-body-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><CalendarClock className="h-4 w-4" />{formatTime(`${cls.startTime}–${cls.endTime}`)}</span>
                    <span className="inline-flex items-center gap-1"><BookOpen className="h-4 w-4" />{cls.room}</span>
                  </div>
                  <Button asChild variant={cls.attendanceStatus === "COMPLETED" ? "outline" : "primary"} className="w-full">
                    <Link href={`/dashboard/teacher/attendance?batch=${cls.batchId}`}>
                      {cls.attendanceStatus === "COMPLETED" ? "View Attendance" : "Take Attendance"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Attendance Pending + Assignments To Review + Tests To Evaluate */}
      <section className="grid gap-4 lg:grid-cols-3">
        <MiniSection
          title="Attendance Pending"
          icon={<UserCheck className="h-5 w-5" />}
          count={stats?.pendingAttendance ?? 0}
          href="/dashboard/teacher/attendance"
          emptyText="All caught up for today."
        />
        <MiniSection
          title="Assignments To Review"
          icon={<ClipboardList className="h-5 w-5" />}
          count={draftAssignments.length}
          href="/dashboard/teacher/assignments"
          emptyText="No drafts waiting."
        />
        <MiniSection
          title="Tests To Evaluate"
          icon={<CheckSquare className="h-5 w-5" />}
          count={toEvaluateTests.length}
          href="/dashboard/teacher/marks"
          emptyText="Nothing to grade."
        />
      </section>

      {/* Recent Activity */}
      <section className="space-y-3">
        <h3 className="font-heading text-heading-sm font-semibold text-foreground">Recent Activity</h3>
        <Card className="shadow-sm">
          <CardContent className="p-5">
            {publishedAssignments.length === 0 && upcomingTests.length === 0 ? (
              <EmptyState
                icon={<History className="h-8 w-8" />}
                title="No recent activity"
                description="Published assignments and scheduled tests will appear here."
              />
            ) : (
              <ul role="list" className="space-y-3">
                {publishedAssignments.slice(0, 3).map((a) => (
                  <ActivityRow key={`a-${a.id}`} icon={<ClipboardList className="h-4 w-4" />} title="Assignment published" detail={`${a.title} · ${a.batchName}`} />
                ))}
                {upcomingTests.slice(0, 3).map((t) => (
                  <ActivityRow key={`t-${t.id}`} icon={<CheckSquare className="h-4 w-4" />} title="Test scheduled" detail={`${t.title} · ${t.testDate}`} />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Quick Actions */}
      <section className="space-y-3">
        <h3 className="font-heading text-heading-sm font-semibold text-foreground">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {quickActions.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card p-5 text-center shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <q.icon className="h-5 w-5" />
              </span>
              <span className="text-body-sm font-medium text-foreground">{q.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function MiniSection({
  title,
  icon,
  count,
  href,
  emptyText,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  href: string;
  emptyText: string;
}) {
  return (
    <Link href={href} className="block rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</span>
        <div>
          <p className="text-h4 font-semibold text-foreground">{count}</p>
          <p className="text-body-sm text-muted-foreground">{title}</p>
        </div>
      </div>
      {count === 0 && <p className="mt-3 text-body-sm text-muted-foreground">{emptyText}</p>}
    </Link>
  );
}

function ActivityRow({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <p className="text-body-sm font-medium text-foreground">{title}</p>
        <p className="truncate text-body-sm text-muted-foreground">{detail}</p>
      </div>
    </li>
  );
}
