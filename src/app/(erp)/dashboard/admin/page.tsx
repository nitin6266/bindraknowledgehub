import { assertRole } from "@/lib/auth/authorize";
import { ROLES } from "@/constants/roles";
import { prisma } from "@/database/prisma";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Users, GraduationCap, IndianRupee, BookOpen, Layers, Receipt } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await assertRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]);

  const [students, teachers, batches, sessions, feeStructures, categories] = await Promise.all([
    prisma.student.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { deletedAt: null, role: { name: ROLES.TEACHER } } }),
    prisma.batch.count({ where: { deletedAt: null } }),
    prisma.academicSession.count({ where: { deletedAt: null } }),
    prisma.feeStructure.count({ where: { deletedAt: null, status: "ACTIVE" } }),
    prisma.feeCategory.count({ where: { deletedAt: null } }),
  ]);

  const stats = [
    { label: "Students", value: students, icon: <GraduationCap className="h-5 w-5" />, tone: "primary" as const },
    { label: "Teachers", value: teachers, icon: <Users className="h-5 w-5" />, tone: "accent" as const },
    { label: "Active Batches", value: batches, icon: <BookOpen className="h-5 w-5" />, tone: "accent" as const },
    { label: "Sessions", value: sessions, icon: <Layers className="h-5 w-5" />, tone: "warning" as const },
    { label: "Fee Structures", value: feeStructures, icon: <IndianRupee className="h-5 w-5" />, tone: "success" as const },
    { label: "Fee Categories", value: categories, icon: <Receipt className="h-5 w-5" />, tone: "danger" as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Administration"
        title="Admin Dashboard"
        description="School-wide management and reporting at a glance."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} tone={s.tone} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickLink href="/dashboard/admin/users" title="User Management" description="Staff & parent accounts" />
        <QuickLink href="/dashboard/students" title="Students" description="Admissions & records" />
        <QuickLink href="/dashboard/academic" title="Academic" description="Sessions, classes, subjects" />
        <QuickLink href="/dashboard/academic/batch" title="Batches" description="Batch allocation" />
        <QuickLink href="/dashboard/finance" title="Finance" description="Fees & collections" />
        <QuickLink href="/dashboard/reports" title="Reports" description="Operational metrics" />
      </div>
    </div>
  );
}

function QuickLink({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link href={href} className="block rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-primary/5">
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-1 text-body-sm text-muted-foreground">{description}</p>
    </Link>
  );
}
