import { notFound } from "next/navigation";
import { assertRole } from "@/lib/auth/authorize";
import { ROLES } from "@/constants/roles";
import { studentRepository } from "@/repositories/student.repository";
import { masterDataRepository } from "@/repositories/master-data.repository";
import { canManageStudent } from "@/features/student/student.constants";
import { PromoteStudentForm } from "@/features/student/components/promote-student-form";
import type { Option } from "@/features/student/student.types";

export const dynamic = "force-dynamic";

interface PromotePageProps {
  params: Promise<{ id: string }>;
}

export default async function PromoteStudentPage({ params }: PromotePageProps) {
  const role = await assertRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]);
  if (!canManageStudent(role)) {
    return <div className="p-8 text-center text-muted-foreground">You are not authorized to promote students.</div>;
  }

  const { id } = await params;
  const detail = await studentRepository.getDetail(id);
  if (!detail) notFound();

  const [sessions, classes] = await Promise.all([
    masterDataRepository.list("academic-session"),
    masterDataRepository.list("class"),
  ]);

  return (
    <PromoteStudentForm
      studentId={id}
      currentClassName={detail.student.className}
      sessions={sessions.map((s) => ({ value: String(s.id), label: String(s.name) })) as Option[]}
      classes={classes.map((c) => ({ value: String(c.id), label: String(c.name) })) as Option[]}
    />
  );
}
