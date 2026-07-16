import { assertRole } from "@/lib/auth/authorize";
import { ROLES } from "@/constants/roles";
import { prisma } from "@/database/prisma";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  await assertRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.PARENT]);

  const [students, batches, teachers, assignments, tests, feeStructures] = await Promise.all([
    prisma.student.count({ where: { deletedAt: null } }),
    prisma.batch.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { deletedAt: null, role: { name: ROLES.TEACHER } } }),
    prisma.assignment.count({ where: { deletedAt: null, status: "PUBLISHED" } }),
    prisma.test.count({ where: { deletedAt: null } }),
    prisma.feeStructure.count({ where: { deletedAt: null, status: "ACTIVE" } }),
  ]);

  const stats = [
    { label: "Students", value: students },
    { label: "Active Batches", value: batches },
    { label: "Teachers", value: teachers },
    { label: "Published Assignments", value: assignments },
    { label: "Tests", value: tests },
    { label: "Active Fee Structures", value: feeStructures },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Reports"
        description="Key operational metrics across the academy."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-body font-medium text-muted-foreground">{s.label}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-h2 font-semibold text-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
