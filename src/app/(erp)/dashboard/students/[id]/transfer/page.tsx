import { notFound } from "next/navigation";
import { assertRole } from "@/lib/auth/authorize";
import { ROLES } from "@/constants/roles";
import { studentRepository } from "@/repositories/student.repository";
import { prisma } from "@/database/prisma";
import { canManageStudent } from "@/features/student/student.constants";
import { TransferStudentForm } from "@/features/student/components/transfer-student-form";
import type { Option } from "@/features/student/student.types";

export const dynamic = "force-dynamic";

interface TransferPageProps {
  params: Promise<{ id: string }>;
}

export default async function TransferStudentPage({ params }: TransferPageProps) {
  const role = await assertRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]);
  if (!canManageStudent(role)) {
    return <div className="p-8 text-center text-muted-foreground">You are not authorized to transfer students.</div>;
  }

  const { id } = await params;
  const detail = await studentRepository.getDetail(id);
  if (!detail) notFound();

  const batches = await prisma.batch.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <TransferStudentForm
      studentId={id}
      currentBatchName={detail.currentBatch?.name ?? null}
      batches={batches.map((b) => ({ value: b.id, label: b.name })) as Option[]}
    />
  );
}
