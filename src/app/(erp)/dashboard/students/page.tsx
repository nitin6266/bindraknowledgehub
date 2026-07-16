import { assertRole } from "@/lib/auth/authorize";
import { createClient } from "@/lib/supabase/server";
import { ROLES } from "@/constants/roles";
import { userRepository } from "@/repositories/user.repository";
import { studentRepository } from "@/repositories/student.repository";
import { masterDataRepository } from "@/repositories/master-data.repository";
import { prisma } from "@/database/prisma";
import { canManageStudent, isTeacherScoped, isParentScoped } from "@/features/student/student.constants";
import type { Option, StudentFilters } from "@/features/student/student.types";
import { StudentListClient } from "@/features/student/components/student-list-client";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { AppWorkspaceTabs } from "@/features/dashboard/shell/app-workspace-tabs";

export const dynamic = "force-dynamic";

interface StudentsPageProps {
  searchParams: Promise<{
    sessionId?: string;
    classId?: string;
    batchId?: string;
    status?: string;
    search?: string;
  }>;
}

export default async function StudentsPage({ searchParams }: StudentsPageProps) {
  const role = await assertRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.PARENT]);
  const canManage = canManageStudent(role);

  const sp = await searchParams;
  const filters: StudentFilters = {
    sessionId: sp.sessionId,
    classId: sp.classId,
    batchId: sp.batchId,
    status: sp.status,
    search: sp.search,
  };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const erpUser = user ? await userRepository.getByAuthId(user.id) : null;
  const scope = isTeacherScoped(role)
    ? { teacherScopeId: erpUser?.id }
    : isParentScoped(role)
      ? { parentScopeId: erpUser?.id }
      : {};

  const students = await studentRepository.list(filters, scope);

  const [sessions, classes, sections, batches] = await Promise.all([
    masterDataRepository.list("academic-session"),
    masterDataRepository.list("class"),
    masterDataRepository.list("section"),
    prisma.batch.findMany({ where: { deletedAt: null }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  const options = {
    sessions: sessions.map((s) => ({ value: String(s.id), label: String(s.name) })) as Option[],
    classes: classes.map((c) => ({ value: String(c.id), label: String(c.name) })) as Option[],
    sections: sections.map((x) => ({ value: String(x.id), label: String(x.name) })) as Option[],
    batches: batches.map((b) => ({ value: b.id, label: b.name })) as Option[],
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Management"
        title="Student Management"
        description="Admit, track and manage every student across batches and sessions."
      />
      <AppWorkspaceTabs workspace="students" />
      <StudentListClient students={students} options={options} canManage={canManage} />
    </div>
  );
}
