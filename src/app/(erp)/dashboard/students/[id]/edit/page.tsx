import { notFound } from "next/navigation";
import { assertRole } from "@/lib/auth/authorize";
import { ROLES } from "@/constants/roles";
import { studentRepository } from "@/repositories/student.repository";
import { canManageStudent } from "@/features/student/student.constants";
import { EditStudentForm } from "@/features/student/components/edit-student-form";

export const dynamic = "force-dynamic";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditStudentPage({ params }: EditPageProps) {
  const role = await assertRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]);
  if (!canManageStudent(role)) {
    return <div className="p-8 text-center text-muted-foreground">You are not authorized to edit students.</div>;
  }

  const { id } = await params;
  const detail = await studentRepository.getDetail(id);
  if (!detail) notFound();

  return <EditStudentForm detail={detail} />;
}
