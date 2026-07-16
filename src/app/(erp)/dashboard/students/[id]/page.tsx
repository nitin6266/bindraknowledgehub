import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { assertRole } from "@/lib/auth/authorize";
import { ROLES } from "@/constants/roles";
import { userRepository } from "@/repositories/user.repository";
import { studentRepository } from "@/repositories/student.repository";
import { masterDataRepository } from "@/repositories/master-data.repository";
import { prisma } from "@/database/prisma";
import { canManageStudent, isTeacherScoped, isParentScoped } from "@/features/student/student.constants";
import type { Option } from "@/features/student/student.types";
import { StudentDetailClient } from "@/features/student/components/student-detail-client";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

interface StudentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const role = await assertRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.PARENT]);
  const canManage = canManageStudent(role);
  const { id } = await params;

  const detail = await studentRepository.getDetail(id);
  if (!detail) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const erpUser = user ? await userRepository.getByAuthId(user.id) : null;

  if (isParentScoped(role)) {
    const allowed = detail.parents.some((p) => p.parentId === erpUser?.id);
    if (!allowed) notFound();
  }
  if (isTeacherScoped(role)) {
    const taught = await prisma.batchTeacher.findMany({
      where: { teacherId: erpUser?.id ?? "___none___", unassignedAt: null },
      select: { batchId: true },
    });
    const taughtIds = new Set(taught.map((t) => t.batchId));
    if (!detail.student.batchId || !taughtIds.has(detail.student.batchId)) {
      notFound();
    }
  }

  const [sessions, classes, batches] = await Promise.all([
    masterDataRepository.list("academic-session"),
    masterDataRepository.list("class"),
    prisma.batch.findMany({ where: { deletedAt: null }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  const options = {
    sessions: sessions.map((s) => ({ value: String(s.id), label: String(s.name) })) as Option[],
    classes: classes.map((c) => ({ value: String(c.id), label: String(c.name) })) as Option[],
    batches: batches.map((b) => ({ value: b.id, label: b.name })) as Option[],
  };

  const fullName = `${detail.student.firstName} ${detail.student.lastName}`.trim();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`Admission ${detail.student.admissionNumber}`}
        title={fullName}
      />
      <StudentDetailClient detail={detail} options={options} canManage={canManage} />
    </div>
  );
}
