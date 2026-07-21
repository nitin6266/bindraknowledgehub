import { assertRole } from "@/lib/auth/authorize";
import { ROLES } from "@/constants/roles";
import { masterDataRepository } from "@/repositories/master-data.repository";
import { prisma } from "@/database/prisma";
import { canManageStudent } from "@/features/student/student.constants";
import type { Option } from "@/features/student/student.types";
import { AdmissionWizard } from "@/features/student/components/admission-wizard";

export const dynamic = "force-dynamic";

export default async function NewStudentPage() {
  const role = await assertRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]);
  const canManage = canManageStudent(role);
  if (!canManage) {
    return <div className="p-8 text-center text-muted-foreground">You are not authorized to admit students.</div>;
  }

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

  return <AdmissionWizard options={options} />;
}
