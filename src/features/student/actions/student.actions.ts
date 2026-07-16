"use server";

import { revalidatePath } from "next/cache";

import { authorizeAction } from "@/lib/auth/authorize";
import { ROLES } from "@/constants/roles";
import { studentRepository } from "@/repositories/student.repository";
import { createOrLinkParent } from "@/features/student/student-parent-account";
import {
  admissionSchema,
  promoteSchema,
  transferSchema,
  updateStudentSchema,
  type AdmissionValues,
  type PromoteValues,
  type TransferValues,
} from "@/features/student/student.schemas";
import type { UpdateStudentValues } from "@/features/student/student.types";
import { DOCUMENT_TYPE_OPTIONS } from "@/features/student/student.constants";
import type { DocumentType } from "@prisma/client";

export type ActionResult = { success: true } | { success: false; error: string };

const STUDENTS = "/dashboard/students";
const DOCUMENT_BUCKET = "student-documents";

function detailPath(id: string) {
  return `/dashboard/students/${id}`;
}

async function requireManager() {
  const actor = await authorizeAction([ROLES.SUPER_ADMIN, ROLES.ADMIN]);
  if (!actor) {
    return { success: false as const, error: "You are not authorized to manage students." };
  }
  return null;
}

function asPrismaError(err: unknown): string | null {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as { code?: string }).code;
    if (code === "P2002") return "A record with this value already exists.";
    if (code === "P2003") return "One of the linked records no longer exists.";
  }
  return null;
}

export async function createStudentAction(values: AdmissionValues): Promise<ActionResult> {
  const deny = await requireManager();
  if (deny) return deny;

  const parsed = admissionSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Validation failed. Please check the form." };
  }

  try {
    const parent = await createOrLinkParent({
      email: parsed.data.parentEmail,
      firstName: parsed.data.parentFirstName,
      lastName: parsed.data.parentLastName,
      mobile: parsed.data.parentMobile,
      address: parsed.data.parentAddress,
    });

    await studentRepository.createAdmission(parsed.data, {
      parentId: parent.id,
      relationship: parsed.data.relationship,
      isPrimary: true,
      forcePasswordChange: true,
    });

    revalidatePath(STUDENTS);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Could not admit student." };
  }
}

export async function updateStudentAction(id: string, values: UpdateStudentValues): Promise<ActionResult> {
  const deny = await requireManager();
  if (deny) return deny;

  const parsed = updateStudentSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid student data." };
  }

  try {
    await studentRepository.updateCore(id, parsed.data);
    revalidatePath(STUDENTS);
    revalidatePath(detailPath(id));
    return { success: true };
  } catch (err) {
    return { success: false, error: asPrismaError(err) ?? (err instanceof Error ? err.message : "Could not update student.") };
  }
}

export async function deactivateStudentAction(id: string): Promise<ActionResult> {
  const deny = await requireManager();
  if (deny) return deny;
  try {
    await studentRepository.setStatus(id, "INACTIVE");
    revalidatePath(STUDENTS);
    revalidatePath(detailPath(id));
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Could not deactivate student." };
  }
}

export async function archiveStudentAction(id: string): Promise<ActionResult> {
  const deny = await requireManager();
  if (deny) return deny;
  try {
    await studentRepository.setStatus(id, "LEFT");
    revalidatePath(STUDENTS);
    revalidatePath(detailPath(id));
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Could not archive student." };
  }
}

export async function deleteStudentAction(id: string): Promise<ActionResult> {
  const deny = await requireManager();
  if (deny) return deny;
  try {
    await studentRepository.softDelete(id);
    revalidatePath(STUDENTS);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Could not delete student." };
  }
}

export async function changeBatchAction(id: string, toBatchId: string, reason?: string): Promise<ActionResult> {
  const deny = await requireManager();
  if (deny) return deny;
  try {
    await studentRepository.allocateBatch(id, toBatchId, reason, "ALLOCATION");
    revalidatePath(STUDENTS);
    revalidatePath(detailPath(id));
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Could not change batch." };
  }
}

export async function transferStudentAction(id: string, values: TransferValues): Promise<ActionResult> {
  const deny = await requireManager();
  if (deny) return deny;
  const parsed = transferSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Validation failed. Please check the form." };
  }
  try {
    await studentRepository.allocateBatch(id, parsed.data.toBatchId, parsed.data.reason, "TRANSFER");
    revalidatePath(STUDENTS);
    revalidatePath(detailPath(id));
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Could not transfer student." };
  }
}

export async function promoteStudentAction(id: string, values: PromoteValues): Promise<ActionResult> {
  const deny = await requireManager();
  if (deny) return deny;
  const parsed = promoteSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Validation failed. Please check the form." };
  }
  try {
    await studentRepository.promote(id, parsed.data);
    revalidatePath(STUDENTS);
    revalidatePath(detailPath(id));
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Could not promote student." };
  }
}

export async function promoteBulkAction(ids: string[], values: PromoteValues): Promise<ActionResult> {
  const deny = await requireManager();
  if (deny) return deny;
  const parsed = promoteSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Validation failed. Please check the form." };
  }
  if (!ids.length) {
    return { success: false, error: "No students selected." };
  }
  try {
    await studentRepository.promoteBulk(ids, parsed.data);
    revalidatePath(STUDENTS);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Could not promote students." };
  }
}

export async function uploadDocumentAction(formData: FormData): Promise<ActionResult> {
  const deny = await requireManager();
  if (deny) return deny;

  const studentId = String(formData.get("studentId") ?? "");
  const type = String(formData.get("type") ?? "");
  const file = formData.get("file");

  if (!studentId || !type) {
    return { success: false, error: "Missing student or document type." };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Please choose a file to upload." };
  }
  if (!DOCUMENT_TYPE_OPTIONS.some((o) => o.value === type)) {
    return { success: false, error: "Invalid document type." };
  }

  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    await supabase.storage.createBucket(DOCUMENT_BUCKET, { public: true }).catch(() => undefined);

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `students/${studentId}/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from(DOCUMENT_BUCKET).upload(path, file, { upsert: true });
    if (error) {
      return { success: false, error: error.message };
    }
    const { data } = supabase.storage.from(DOCUMENT_BUCKET).getPublicUrl(path);

    await studentRepository.addDocument({
      studentId,
      type: type as DocumentType,
      fileName: file.name,
      fileUrl: data.publicUrl,
      storagePath: path,
    });

    revalidatePath(detailPath(studentId));
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Could not upload document." };
  }
}

export async function removeDocumentAction(id: string, studentId: string): Promise<ActionResult> {
  const deny = await requireManager();
  if (deny) return deny;
  try {
    await studentRepository.removeDocument(id);
    revalidatePath(detailPath(studentId));
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Could not remove document." };
  }
}
