import { assertRole } from "@/lib/auth/authorize";
import { ROLES } from "@/constants/roles";
import {
  UserPlus,
  Users2,
  GraduationCap,
  ClipboardCheck,
  Wallet,
  FilePlus2,
  FileText,
  BookOpen,
  IndianRupee,
  Megaphone,
  Inbox,
  Receipt,
  AlertTriangle,
} from "lucide-react";

import { PageHeader } from "@/features/dashboard/components/page-header";
import { AppWorkspaceTabs } from "@/features/dashboard/shell/app-workspace-tabs";
import {
  SectionCard,
  KpiCard,
  QuickActions,
  DepartmentShortcuts,
  ActivityTimeline,
  EventList,
} from "@/features/dashboard/admin/components/admin-dashboard";
import { getAdminDashboardData } from "@/features/dashboard/admin/admin-dashboard.data";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

function greeting(date: Date): string {
  const h = date.getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const QUOTES = [
  "Education is the most powerful weapon which you can use to change the world.",
  "The roots of education are bitter, but the fruit is sweet.",
  "Teaching is the highest form of understanding.",
  "A child's mind is not a vessel to be filled, but a fire to be kindled.",
];

export default async function AdminDashboardPage() {
  await assertRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]);

  const data = await getAdminDashboardData();
  const quote = QUOTES[data.today.getDate() % QUOTES.length];

  const dayName = data.today.toLocaleString("en-IN", { weekday: "long" });
  const dateLabel = data.today.toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Administration"
        title="Admin Dashboard"
        description="School-wide management and reporting at a glance."
      />

      <AppWorkspaceTabs workspace="administration" />

      {/* Section 1 — Welcome */}
      <section className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-transparent p-6">
        <p className="text-body-sm font-medium text-primary">
          {greeting(data.today)}, {data.adminName}
        </p>
        <h2 className="mt-1 font-heading text-heading-lg font-bold text-foreground">
          Here&apos;s what requires your attention today
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-body-sm text-muted-foreground">
          <span>
            <span className="font-medium text-foreground">{dayName}</span>, {dateLabel}
          </span>
          {data.sessionName && (
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-primary" />
              Session: <span className="font-medium text-foreground">{data.sessionName}</span>
            </span>
          )}
        </div>
        <p className="mt-3 text-body-sm italic text-muted-foreground">&ldquo;{quote}&rdquo;</p>
      </section>

      {/* Section 2 — Today's Summary */}
      <section className="space-y-3">
        <h3 className="font-heading text-heading-sm font-semibold text-foreground">Today&apos;s Summary</h3>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-5">
          <KpiCard
            label="Students Present"
            value={data.summary.studentsPresent}
            icon={<Users2 className="h-5 w-5" />}
            tone="success"
          />
          <KpiCard
            label="Students Absent"
            value={data.summary.studentsAbsent}
            icon={<ClipboardCheck className="h-5 w-5" />}
            tone="danger"
          />
          <KpiCard
            label="Pending Admissions"
            value={data.summary.admissionsToday}
            icon={<UserPlus className="h-5 w-5" />}
            tone="warning"
            href="/dashboard/students"
          />
          <KpiCard
            label="Fee Collection Today"
            value={formatINR(data.summary.collectionToday)}
            icon={<Wallet className="h-5 w-5" />}
            tone="primary"
            href="/dashboard/finance/collection"
          />
          <KpiCard
            label="Pending Leave Requests"
            value={data.summary.pendingLeaves}
            icon={<Inbox className="h-5 w-5" />}
            tone="accent"
            href="/dashboard/parent/leave"
          />
        </div>
      </section>

      {/* Section 3 — Quick Actions */}
      <section className="space-y-3">
        <h3 className="font-heading text-heading-sm font-semibold text-foreground">Quick Actions</h3>
        <QuickActions
          actions={[
            { label: "Add Student", href: "/dashboard/students", icon: <UserPlus className="h-5 w-5" /> },
            { label: "Create Batch", href: "/dashboard/academic/batch", icon: <GraduationCap className="h-5 w-5" /> },
            { label: "Add Teacher", href: "/dashboard/teachers", icon: <Users2 className="h-5 w-5" /> },
            { label: "Take Attendance", href: "/dashboard/teacher/attendance", icon: <ClipboardCheck className="h-5 w-5" /> },
            { label: "Collect Fees", href: "/dashboard/finance/collection", icon: <Wallet className="h-5 w-5" /> },
            { label: "Create Assignment", href: "/dashboard/teacher/assignments/new", icon: <FilePlus2 className="h-5 w-5" /> },
            { label: "Create Test", href: "/dashboard/teacher/tests/new", icon: <FileText className="h-5 w-5" /> },
          ]}
        />
      </section>

      {/* Section 4 — Academic Overview */}
      <section className="space-y-3">
        <h3 className="font-heading text-heading-sm font-semibold text-foreground">Academic Overview</h3>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <KpiCard label="Active Classes" value={data.academic.activeClasses} icon={<BookOpen className="h-5 w-5" />} tone="primary" href="/dashboard/academic/class" />
          <KpiCard label="Active Batches" value={data.academic.activeBatches} icon={<GraduationCap className="h-5 w-5" />} tone="accent" href="/dashboard/academic/batch" />
          <KpiCard label="Teachers Teaching Today" value={data.academic.teachersTeachingToday} icon={<Users2 className="h-5 w-5" />} tone="success" href="/dashboard/teachers" />
          <KpiCard label="Assignments Pending" value={data.academic.assignmentsPending} icon={<FilePlus2 className="h-5 w-5" />} tone="warning" href="/dashboard/teacher/assignments" />
          <KpiCard label="Tests Scheduled" value={data.academic.testsScheduled} icon={<FileText className="h-5 w-5" />} tone="danger" href="/dashboard/teacher/tests" />
        </div>
      </section>

      {/* Section 5 — Finance Overview */}
      <section className="space-y-3">
        <h3 className="font-heading text-heading-sm font-semibold text-foreground">Finance Overview</h3>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <KpiCard label="Today's Collection" value={formatINR(data.finance.collectionToday)} icon={<IndianRupee className="h-5 w-5" />} tone="primary" />
            <KpiCard label="Pending Fees" value={data.finance.pendingFees} icon={<Wallet className="h-5 w-5" />} tone="warning" href="/dashboard/finance/outstanding" />
            <KpiCard label="Overdue Students" value={data.finance.overdueStudents} icon={<AlertTriangle className="h-5 w-5" />} tone="danger" href="/dashboard/finance/outstanding" />
          </div>
          <div className="lg:col-span-2">
            <SectionCard title="Recent Receipts" actionHref="/dashboard/finance/receipts" actionLabel="View all">
              {data.finance.recentReceipts.length === 0 ? (
                <EmptyState
                  icon={<Receipt className="h-8 w-8" />}
                  title="No receipts yet"
                  description="Generated fee receipts will appear here."
                />
              ) : (
                <ul role="list" className="divide-y divide-border">
                  {data.finance.recentReceipts.map((r) => (
                    <li key={r.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="text-body-sm font-medium text-foreground">{r.studentName}</p>
                        <p className="text-body-xs text-muted-foreground">{r.receiptNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-body-sm font-semibold text-success">{formatINR(r.amount)}</p>
                        <p className="text-body-xs text-muted-foreground">
                          {r.date.toLocaleString("en-IN", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>
          </div>
        </div>
      </section>

      {/* Section 6 — Recent Activity */}
      <SectionCard title="Recent Activity">
        <ActivityTimeline items={data.activity} />
      </SectionCard>

      {/* Section 7 — Department Shortcuts */}
      <section className="space-y-3">
        <h3 className="font-heading text-heading-sm font-semibold text-foreground">Department Shortcuts</h3>
        <DepartmentShortcuts
          items={[
            { label: "Students", description: "Admissions & records", href: "/dashboard/students", icon: <Users2 className="h-5 w-5" /> },
            { label: "Teachers", description: "Staff management", href: "/dashboard/teachers", icon: <GraduationCap className="h-5 w-5" /> },
            { label: "Academics", description: "Sessions, classes, batches", href: "/dashboard/academics", icon: <BookOpen className="h-5 w-5" /> },
            { label: "Finance", description: "Fees & collections", href: "/dashboard/finance", icon: <IndianRupee className="h-5 w-5" /> },
            { label: "Reports", description: "Operational metrics", href: "/dashboard/reports", icon: <FileText className="h-5 w-5" /> },
            { label: "Administration", description: "Users & settings", href: "/dashboard/admin/users", icon: <Megaphone className="h-5 w-5" /> },
          ]}
        />
      </section>

      {/* Section 8 — Upcoming Events */}
      <SectionCard title="Upcoming Events" actionHref="/dashboard/academic/academic-calendar" actionLabel="Calendar">
        <EventList items={data.events} />
      </SectionCard>
    </div>
  );
}
