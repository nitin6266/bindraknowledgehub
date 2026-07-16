"use server";

import { revalidatePath } from "next/cache";

import { authorizeAction } from "@/lib/auth/authorize";
import { ROLES } from "@/constants/roles";
import { batchRepository } from "@/repositories/batch.repository";
import {
  batchSchema,
  scheduleSchema,
  teacherSchema,
  subjectSchema,
  type BatchValues,
  type ScheduleValues,
  type TeacherValues,
  type SubjectValues,
} from "@/features/batch/batch.schemas";
import type { ScheduleFormValues, TeacherFormValues, SubjectFormValues } from "@/features/batch/batch.types";

export type ActionResult = { success: true } | { success: false; error: string };

const BATCH_LIST = "/dashboard/academic/batch";

function detailPath(id: string): string {
  return `/dashboard/academic/batch/${id}`;
}

function asPrismaError(err: unknown): string | null {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as { code?: string }).code;
    if (code === "P2002") {
      const target = (err as { meta?: { target?: unknown } }).meta?.target;
      const field = Array.isArray(target) ? target.join(", ") : typeof target === "string" ? target : "value";
      return `A record with this ${field} already exists.`;
    }
    if (code === "P2003") {
      return "One of the linked records no longer exists.";
    }
  }
  return null;
}

function toBatchData(values: BatchValues): Record<string, unknown> {
  return {
    name: values.name,
    code: values.code,
    sessionId: values.sessionId,
    classId: values.classId,
    sectionId: values.sectionId || undefined,
    batchTypeId: values.batchTypeId,
    capacity: Number(values.capacity),
    currentStrength: Number(values.currentStrength),
    status: values.status,
    description: values.description || undefined,
  };
}

async function requireManager(): Promise<ActionResult | null> {
  const actor = await authorizeAction([ROLES.SUPER_ADMIN, ROLES.ADMIN]);
  if (!actor) {
    return { success: false, error: "You are not authorized to manage batches." };
  }
  return null;
}

export async function createBatchAction(values: BatchValues): Promise<ActionResult> {
  const deny = await requireManager();
  if (deny) return deny;

  const parsed = batchSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Validation failed. Please check the form." };
  }

  try {
    await batchRepository.create(toBatchData(parsed.data));
    revalidatePath(BATCH_LIST);
    return { success: true };
  } catch (err) {
    return { success: false, error: asPrismaError(err) ?? (err instanceof Error ? err.message : "Could not create batch.") };
  }
}

export async function updateBatchAction(id: string, values: BatchValues): Promise<ActionResult> {
  const deny = await requireManager();
  if (deny) return deny;

  const parsed = batchSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Validation failed. Please check the form." };
  }

  try {
    await batchRepository.update(id, toBatchData(parsed.data));
    revalidatePath(BATCH_LIST);
    revalidatePath(detailPath(id));
    return { success: true };
  } catch (err) {
    return { success: false, error: asPrismaError(err) ?? (err instanceof Error ? err.message : "Could not update batch.") };
  }
}

export async function archiveBatchAction(id: string): Promise<ActionResult> {
  const deny = await requireManager();
  if (deny) return deny;

  try {
    await batchRepository.archive(id);
    revalidatePath(BATCH_LIST);
    revalidatePath(detailPath(id));
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Could not archive batch." };
  }
}

export async function deleteBatchAction(id: string): Promise<ActionResult> {
  const deny = await requireManager();
  if (deny) return deny;

  try {
    await batchRepository.softDelete(id);
    revalidatePath(BATCH_LIST);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Could not delete batch." };
  }
}

export async function cloneBatchAction(id: string): Promise<ActionResult> {
  const deny = await requireManager();
  if (deny) return deny;

  try {
    await batchRepository.clone(id);
    revalidatePath(BATCH_LIST);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Could not clone batch." };
  }
}

export async function addScheduleAction(batchId: string, values: ScheduleValues): Promise<ActionResult> {
  const deny = await requireManager();
  if (deny) return deny;

  const parsed = scheduleSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Validation failed. Please check the form." };
  }

  try {
    const overlaps = await batchRepository.scheduleOverlaps(batchId, parsed.data.day, parsed.data.startTime, parsed.data.endTime);
    if (overlaps) {
      return { success: false, error: "This timing overlaps with an existing schedule for the batch." };
    }
    await batchRepository.addSchedule(batchId, parsed.data as ScheduleFormValues);
    revalidatePath(detailPath(batchId));
    return { success: true };
  } catch (err) {
    return { success: false, error: asPrismaError(err) ?? (err instanceof Error ? err.message : "Could not add schedule.") };
  }
}

export async function removeScheduleAction(batchId: string, scheduleId: string): Promise<ActionResult> {
  const deny = await requireManager();
  if (deny) return deny;

  try {
    await batchRepository.removeSchedule(batchId, scheduleId);
    revalidatePath(detailPath(batchId));
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Could not remove schedule." };
  }
}

export async function addTeacherAction(batchId: string, values: TeacherValues): Promise<ActionResult> {
  const deny = await requireManager();
  if (deny) return deny;

  const parsed = teacherSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Validation failed. Please check the form." };
  }

  try {
    await batchRepository.addTeacher(batchId, parsed.data as TeacherFormValues);
    revalidatePath(detailPath(batchId));
    return { success: true };
  } catch (err) {
    return { success: false, error: asPrismaError(err) ?? (err instanceof Error ? err.message : "Could not assign teacher.") };
  }
}

export async function removeTeacherAction(batchId: string, teacherId: string): Promise<ActionResult> {
  const deny = await requireManager();
  if (deny) return deny;

  try {
    await batchRepository.removeTeacher(batchId, teacherId);
    revalidatePath(detailPath(batchId));
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Could not remove teacher." };
  }
}

export async function addSubjectAction(batchId: string, values: SubjectValues): Promise<ActionResult> {
  const deny = await requireManager();
  if (deny) return deny;

  const parsed = subjectSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Validation failed. Please check the form." };
  }

  try {
    await batchRepository.addSubject(batchId, parsed.data as SubjectFormValues);
    revalidatePath(detailPath(batchId));
    return { success: true };
  } catch (err) {
    return { success: false, error: asPrismaError(err) ?? (err instanceof Error ? err.message : "Could not assign subject.") };
  }
}

export async function removeSubjectAction(batchId: string, subjectId: string): Promise<ActionResult> {
  const deny = await requireManager();
  if (deny) return deny;

  try {
    await batchRepository.removeSubject(batchId, subjectId);
    revalidatePath(detailPath(batchId));
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Could not remove subject." };
  }
}
