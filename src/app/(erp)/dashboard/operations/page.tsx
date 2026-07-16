import { assertRole } from "@/lib/auth/authorize";
import { ROLES } from "@/constants/roles";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { Calendar, ClipboardList, FileText, Award } from "lucide-react";

export const metadata = {
  title: "Operations | Bindra Knowledge Hub ERP",
};

export default async function OperationsWorkspacePage() {
  await assertRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.PARENT]);

  const operations = [
    {
      title: "Attendance",
      description: "Record and track daily attendance",
      href: "/dashboard/attendance",
      icon: Calendar,
      roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER],
    },
    {
      title: "Assignments",
      description: "Create and manage assignments",
      href: "/dashboard/assignments",
      icon: ClipboardList,
      roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER],
    },
    {
      title: "Tests",
      description: "Create and manage tests and exams",
      href: "/dashboard/tests",
      icon: FileText,
      roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER],
    },
    {
      title: "Marks",
      description: "Record and manage student marks",
      href: "/dashboard/marks",
      icon: Award,
      roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operations"
        description="Daily academic operations and classroom management."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {operations.map((op) => (
          <Link key={op.title} href={op.href} className="group">
            <Card className="h-full transition-colors group-hover:border-primary/40 group-hover:bg-primary/5">
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <op.icon className="size-5" />
                </span>
                <div>
                  <CardTitle className="text-base">{op.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{op.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}