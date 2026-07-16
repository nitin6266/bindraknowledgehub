import { TeacherDashboardClient } from "@/features/teacher/components/teacher-dashboard-client";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TeacherDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Teacher Dashboard"
        description="Overview of your classes, attendance, and tasks"
        primaryAction={{ label: "New Assignment", href: "/dashboard/teacher/assignments/new", icon: <Plus className="h-4 w-4" /> }}
      />
      <TeacherDashboardClient />
    </div>
  );
}