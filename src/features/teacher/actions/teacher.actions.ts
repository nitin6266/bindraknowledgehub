"use server";

import { revalidatePath } from "next/cache";

import { authorizeAction } from "@/lib/auth/authorize";
import { createClient } from "@/lib/supabase/server";
import { ROLES } from "@/constants/roles";
import { teacherRepository } from "@/repositories/teacher.repository";
import { prisma } from "@/database/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  attendanceFormSchema,
  assignmentFormSchema,
  testFormSchema,
  marksEntryFormSchema,
  teacherProfileFormSchema,
  type AttendanceFormValues,
  type AssignmentFormValues,
  type TestFormValues,
  type MarksEntryFormValues,
  type TeacherProfileFormValues,
} from "@/features/teacher/teacher.schemas";
import type {
  DashboardStats,
  TodayClass,
  BatchRow,
  StudentRow,
  AttendanceRecord,
  AttendanceDetailRow,
  AssignmentRow,
  AssignmentAttachmentRow,
  TestRow,
  MarksEntryData,
  TeacherProfileData,
} from "@/features/teacher/teacher.types";

type TeacherActionResult<T> = { success: true; data: T } | { success: false; error: string };

const TEACHER_BASE = "/dashboard/teacher";

async function getAuthenticatedTeacherId(): Promise<
  { success: true; teacherId: string; role: string; userId: string } | { success: false; error: string }
> {
  const actor = await authorizeAction([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER]);
  if (!actor) {
    return { success: false, error: "Unauthorized" };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { success: true, teacherId: actor, role: actor, userId: user?.id ?? actor };
}

export async function getDashboardStats(): Promise<TeacherActionResult<DashboardStats>> {
  const auth = await getAuthenticatedTeacherId();
  if (!auth.success) return { success: false, error: auth.error };

  try {
    const stats = await teacherRepository.getDashboardStats(auth.teacherId);
    return { success: true, data: stats };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to load dashboard stats" };
  }
}

export async function getTodayClasses(): Promise<TeacherActionResult<TodayClass[]>> {
  const auth = await getAuthenticatedTeacherId();
  if (!auth.success) return { success: false, error: auth.error };

  try {
    const classes = await teacherRepository.getTodayClasses(auth.teacherId);
    return { success: true, data: classes };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to load today's classes" };
  }
}

export async function listMyBatches(
  filters: Record<string, string> = {},
): Promise<TeacherActionResult<BatchRow[]>> {
  const auth = await getAuthenticatedTeacherId();
  if (!auth.success) return { success: false, error: auth.error };

  try {
    const batches = await teacherRepository.listBatches(filters, { teacherScopeId: auth.teacherId });
    return { success: true, data: batches };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to load batches" };
  }
}

export async function listMyStudents(
  filters: Record<string, string> = {},
): Promise<TeacherActionResult<StudentRow[]>> {
  const auth = await getAuthenticatedTeacherId();
  if (!auth.success) return { success: false, error: auth.error };

  try {
    const students = await teacherRepository.listStudents(filters, { teacherScopeId: auth.teacherId });
    return { success: true, data: students };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to load students" };
  }
}

export async function listAttendanceRecords(
  filters: Record<string, string> = {},
): Promise<TeacherActionResult<AttendanceRecord[]>> {
  const auth = await getAuthenticatedTeacherId();
  if (!auth.success) return { success: false, error: auth.error };

  try {
    const records = await teacherRepository.listAttendanceRecords(filters, { teacherScopeId: auth.teacherId });
    return { success: true, data: records };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to load attendance records" };
  }
}

export async function getAttendanceDetail(
  attendanceId: string,
): Promise<TeacherActionResult<AttendanceDetailRow[]>> {
  const auth = await getAuthenticatedTeacherId();
  if (!auth.success) return { success: false, error: auth.error };

  try {
    const detail = await teacherRepository.getAttendanceDetail(attendanceId);
    return { success: true, data: detail };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to load attendance detail" };
  }
}

export async function upsertAttendance(
  values: AttendanceFormValues,
): Promise<TeacherActionResult<{ id: string }>> {
  const auth = await getAuthenticatedTeacherId();
  if (!auth.success) return { success: false, error: auth.error };

  const parsed = attendanceFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Validation failed. Please check the form." };
  }

  try {
    const result = await teacherRepository.upsertAttendance({
      ...parsed.data,
      markedBy: auth.teacherId,
    });
    revalidatePath(`${TEACHER_BASE}/attendance`);
    return { success: true, data: result };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to save attendance" };
  }
}

export async function listAssignments(
  filters: Record<string, string> = {},
): Promise<TeacherActionResult<AssignmentRow[]>> {
  const auth = await getAuthenticatedTeacherId();
  if (!auth.success) return { success: false, error: auth.error };

  try {
    const assignments = await teacherRepository.listAssignments(filters, { teacherScopeId: auth.teacherId });
    return { success: true, data: assignments };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to load assignments" };
  }
}

export async function getAssignmentAttachments(
  assignmentId: string,
): Promise<TeacherActionResult<AssignmentAttachmentRow[]>> {
  const auth = await getAuthenticatedTeacherId();
  if (!auth.success) return { success: false, error: auth.error };

  try {
    const attachments = await teacherRepository.getAssignmentAttachments(assignmentId);
    return { success: true, data: attachments };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to load attachments" };
  }
}

export async function createAssignment(
  values: AssignmentFormValues,
): Promise<TeacherActionResult<{ id: string }>> {
  const auth = await getAuthenticatedTeacherId();
  if (!auth.success) return { success: false, error: auth.error };

  const parsed = assignmentFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Validation failed. Please check the form." };
  }

  try {
    const assignmentId = await teacherRepository.createAssignment({
      title: parsed.data.title,
      description: parsed.data.description,
      subjectId: parsed.data.subjectId,
      batchId: parsed.data.batchId,
      dueDate: new Date(parsed.data.dueDate),
      maxScore: parsed.data.maxMarks,
      status: parsed.data.status,
      teacherId: auth.teacherId,
    });

    if (values.attachments && values.attachments.length > 0) {
      const supabase = createAdminClient();
      const bucket = "teacher-attachments";
      await supabase.storage.createBucket(bucket, { public: true }).catch(() => {});

      for (const file of values.attachments) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `assignments/${assignmentId.id}/${Date.now()}-${safeName}`;
        const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
        if (uploadError) {
          console.error("Attachment upload failed:", uploadError);
          continue;
        }
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        await teacherRepository.addAttachment({
          assignmentId: assignmentId.id,
          fileName: file.name,
          fileUrl: data.publicUrl,
          storagePath: path,
        });
      }
    }

    revalidatePath(`${TEACHER_BASE}/assignments`);
    return { success: true, data: assignmentId };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to create assignment" };
  }
}

export async function updateAssignment(
  id: string,
  values: Partial<AssignmentFormValues>,
): Promise<TeacherActionResult<void>> {
  const auth = await getAuthenticatedTeacherId();
  if (!auth.success) return { success: false, error: auth.error };

  if (auth.role !== ROLES.SUPER_ADMIN && auth.role !== ROLES.ADMIN) {
    const existing = await prisma.assignment.findUnique({ where: { id }, select: { teacherId: true } });
    if (!existing || existing.teacherId !== auth.userId) {
      return { success: false, error: "You can only edit your own assignments." };
    }
  }

  try {
    await teacherRepository.updateAssignment(id, {
      title: values.title,
      description: values.description,
      subjectId: values.subjectId,
      batchId: values.batchId,
      dueDate: values.dueDate ? new Date(values.dueDate) : undefined,
      maxScore: values.maxMarks,
      status: values.status as never,
    });
    revalidatePath(`${TEACHER_BASE}/assignments`);
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update assignment" };
  }
}

export async function listTests(
  filters: Record<string, string> = {},
): Promise<TeacherActionResult<TestRow[]>> {
  const auth = await getAuthenticatedTeacherId();
  if (!auth.success) return { success: false, error: auth.error };

  try {
    const tests = await teacherRepository.listTests(filters, { teacherScopeId: auth.teacherId });
    return { success: true, data: tests };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to load tests" };
  }
}

export async function createTest(values: TestFormValues): Promise<TeacherActionResult<{ id: string }>> {
  const auth = await getAuthenticatedTeacherId();
  if (!auth.success) return { success: false, error: auth.error };

  const parsed = testFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Validation failed. Please check the form." };
  }

  try {
    const testId = await teacherRepository.createTest({
      title: parsed.data.title,
      subjectId: parsed.data.subjectId,
      batchId: parsed.data.batchId,
      testDate: new Date(parsed.data.testDate),
      maxScore: parsed.data.maxMarks,
      description: parsed.data.instructions,
      status: parsed.data.status,
      teacherId: auth.teacherId,
    });
    revalidatePath(`${TEACHER_BASE}/tests`);
    return { success: true, data: testId };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to create test" };
  }
}

export async function updateTest(
  id: string,
  values: Partial<TestFormValues>,
): Promise<TeacherActionResult<void>> {
  const auth = await getAuthenticatedTeacherId();
  if (!auth.success) return { success: false, error: auth.error };

  if (auth.role !== ROLES.SUPER_ADMIN && auth.role !== ROLES.ADMIN) {
    const existing = await prisma.test.findUnique({ where: { id }, select: { teacherId: true } });
    if (!existing || existing.teacherId !== auth.userId) {
      return { success: false, error: "You can only edit your own tests." };
    }
  }

  try {
    await teacherRepository.updateTest(id, {
      title: values.title,
      subjectId: values.subjectId,
      batchId: values.batchId,
      testDate: values.testDate ? new Date(values.testDate) : undefined,
      maxScore: values.maxMarks,
      description: values.instructions,
      status: values.status as never,
    });
    revalidatePath(`${TEACHER_BASE}/tests`);
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update test" };
  }
}

export async function getMarksEntryData(testId: string): Promise<TeacherActionResult<MarksEntryData>> {
  const auth = await getAuthenticatedTeacherId();
  if (!auth.success) return { success: false, error: auth.error };

  try {
    const data = await teacherRepository.getMarksEntryData(testId);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to load marks entry data" };
  }
}

export async function upsertMarksEntry(
  values: MarksEntryFormValues,
): Promise<TeacherActionResult<{ count: number }>> {
  const auth = await getAuthenticatedTeacherId();
  if (!auth.success) return { success: false, error: auth.error };

  const parsed = marksEntryFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Validation failed. Please check the form." };
  }

  try {
    const count = await teacherRepository.upsertTestResults({
      testId: parsed.data.testId,
      results: parsed.data.results,
      gradedBy: auth.teacherId,
    });
    revalidatePath(`${TEACHER_BASE}/marks`);
    return { success: true, data: { count } };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to save marks" };
  }
}

export async function getTeacherProfile(): Promise<TeacherActionResult<TeacherProfileData>> {
  const auth = await getAuthenticatedTeacherId();
  if (!auth.success) return { success: false, error: auth.error };

  try {
    const profile = await teacherRepository.getTeacherProfile(auth.teacherId);
    if (!profile) return { success: false, error: "Profile not found" };
    return { success: true, data: profile };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to load profile" };
  }
}

export async function updateTeacherProfile(
  values: TeacherProfileFormValues,
): Promise<TeacherActionResult<void>> {
  const auth = await getAuthenticatedTeacherId();
  if (!auth.success) return { success: false, error: auth.error };

  const parsed = teacherProfileFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Validation failed. Please check the form." };
  }

  try {
    let photoUrl: string | null = null;
    if (parsed.data.photo) {
      const supabase = createAdminClient();
      const bucket = "teacher-profiles";
      await supabase.storage.createBucket(bucket, { public: true }).catch(() => {});
      const safeName = parsed.data.photo.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${auth.teacherId}/${Date.now()}-${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, parsed.data.photo, { upsert: true });
      if (uploadError) {
        return { success: false, error: "Photo upload failed" };
      }
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      photoUrl = data.publicUrl;
    }

    await teacherRepository.updateTeacherProfile(auth.teacherId, {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      phone: parsed.data.phone || null,
      qualification: parsed.data.qualification || null,
      specialization: parsed.data.specialization || null,
      experienceYears: parsed.data.experienceYears || null,
      photoUrl,
    });

    revalidatePath(`${TEACHER_BASE}/profile`);
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update profile" };
  }
}
