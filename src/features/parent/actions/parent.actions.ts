"use server";

import { revalidatePath } from "next/cache";

import { authorizeAction } from "@/lib/auth/authorize";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { ROLES } from "@/constants/roles";
import { userRepository } from "@/repositories/user.repository";
import { parentRepository } from "@/repositories/parent.repository";
import { financeRepository } from "@/repositories/finance.repository";
import type { ActionResult } from "@/features/student/actions/student.actions";
import type {
  ChildSummary,
  ParentDashboardStats,
  AttendanceDayView,
  AssignmentView,
  TestResultView,
  LeaveRequestRow,
  AnnouncementRow,
  ParentProfileData,
  FeeSummary,
  DocumentItem,
} from "@/features/parent/parent.types";
import type { LeaveRequestValues, ParentProfileValues } from "@/features/parent/parent.schemas";

type ParentActionResult<T> = { success: true; data: T } | { success: false; error: string };

const PARENT_BASE = "/dashboard/parent";

async function requireParent(): Promise<
  { success: true; parentId: string } | { success: false; error: string }
> {
  const actor = await authorizeAction([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.PARENT]);
  if (!actor) {
    return { success: false, error: "You are not authorized to view this page." };
  }
  const authId = await getCurrentUserId();
  if (!authId) {
    return { success: false, error: "Session expired. Please sign in again." };
  }
  const erpUser = await userRepository.getByAuthId(authId);
  if (!erpUser) {
    return { success: false, error: "Account not found. Please contact administration." };
  }
  return { success: true, parentId: erpUser.id };
}

export async function getParentChildren(): Promise<ParentActionResult<ChildSummary[]>> {
  const auth = await requireParent();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    const children = await parentRepository.getChildrenSummaries(auth.parentId);
    return { success: true, data: children };
  } catch {
    return { success: false, error: "Failed to load children." };
  }
}

export async function getParentContext(): Promise<
  ParentActionResult<{ children: ChildSummary[]; selectedChildId: string | null }>
> {
  const auth = await requireParent();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    const children = await parentRepository.getChildrenSummaries(auth.parentId);
    const selectedChildId = await parentRepository.getSelectedChild(auth.parentId);
    return { success: true, data: { children, selectedChildId } };
  } catch {
    return { success: false, error: "Failed to load children." };
  }
}

export async function getParentDashboardStats(): Promise<
  ParentActionResult<{ stats: ParentDashboardStats; children: ChildSummary[] }>
> {
  const auth = await requireParent();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    const children = await parentRepository.getChildrenSummaries(auth.parentId);
    const batchIds = children.map((c) => c.batchId).filter(Boolean);
    const stats = await parentRepository.getDashboardStats(
      auth.parentId,
      children.map((c) => c.id),
      batchIds,
    );
    return { success: true, data: { stats, children } };
  } catch {
    return { success: false, error: "Failed to load dashboard." };
  }
}

export async function getChildAttendance(
  studentId: string,
  year: number,
  month: number,
): Promise<ParentActionResult<AttendanceDayView[]>> {
  const auth = await requireParent();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    const days = await parentRepository.getAttendanceDays(studentId, year, month);
    return { success: true, data: days };
  } catch {
    return { success: false, error: "Failed to load attendance." };
  }
}

export async function getChildAssignments(
  studentId: string,
): Promise<ParentActionResult<AssignmentView[]>> {
  const auth = await requireParent();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    const assignments = await parentRepository.getAssignmentsForStudent(studentId);
    return { success: true, data: assignments };
  } catch {
    return { success: false, error: "Failed to load assignments." };
  }
}

export async function getChildResults(
  studentId: string,
): Promise<ParentActionResult<TestResultView[]>> {
  const auth = await requireParent();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    const results = await parentRepository.getTestResultsForStudent(studentId);
    return { success: true, data: results };
  } catch {
    return { success: false, error: "Failed to load test results." };
  }
}

export async function listLeaveRequests(): Promise<ParentActionResult<LeaveRequestRow[]>> {
  const auth = await requireParent();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    const leaves = await parentRepository.listLeaveRequests(auth.parentId);
    return { success: true, data: leaves };
  } catch {
    return { success: false, error: "Failed to load leave requests." };
  }
}

export async function createLeaveRequest(values: LeaveRequestValues): Promise<ActionResult> {
  const auth = await requireParent();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    await parentRepository.createLeaveRequest(values, auth.parentId);
    revalidatePath(`${PARENT_BASE}/leave`);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to submit leave request." };
  }
}

export async function updateLeaveRequest(
  id: string,
  values: LeaveRequestValues,
): Promise<ActionResult> {
  const auth = await requireParent();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    await parentRepository.updateLeaveRequest(id, values, auth.parentId);
    revalidatePath(`${PARENT_BASE}/leave`);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update leave request." };
  }
}

export async function cancelLeaveRequest(id: string): Promise<ActionResult> {
  const auth = await requireParent();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    await parentRepository.cancelLeaveRequest(id, auth.parentId);
    revalidatePath(`${PARENT_BASE}/leave`);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to cancel leave request." };
  }
}

export async function listAnnouncements(): Promise<ParentActionResult<AnnouncementRow[]>> {
  const auth = await requireParent();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    const children = await parentRepository.getChildrenSummaries(auth.parentId);
    const batchIds = children.map((c) => c.batchId).filter(Boolean);
    const announcements = await parentRepository.listAnnouncements(batchIds);
    return { success: true, data: announcements };
  } catch {
    return { success: false, error: "Failed to load announcements." };
  }
}

export async function getParentProfile(): Promise<ParentActionResult<ParentProfileData | null>> {
  const auth = await requireParent();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    const profile = await parentRepository.getParentProfile(auth.parentId);
    return { success: true, data: profile };
  } catch {
    return { success: false, error: "Failed to load profile." };
  }
}

export async function updateParentProfile(values: ParentProfileValues): Promise<ActionResult> {
  const auth = await requireParent();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    await parentRepository.updateParentProfile(auth.parentId, values);
    revalidatePath(`${PARENT_BASE}/profile`);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update profile." };
  }
}

export async function getFeeSummary(): Promise<ParentActionResult<FeeSummary>> {
  const auth = await requireParent();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    const children = await parentRepository.getChildrenSummaries(auth.parentId);
    const summary = await financeRepository.getParentFeeSummary(children.map((c) => c.id));
    return { success: true, data: summary };
  } catch {
    return { success: false, error: "Failed to load fee summary." };
  }
}

export async function getDocuments(): Promise<ParentActionResult<DocumentItem[]>> {
  const auth = await requireParent();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    const children = await parentRepository.getChildrenSummaries(auth.parentId);
    const documents = await parentRepository.getDocuments(children.map((c) => c.id));
    return { success: true, data: documents };
  } catch {
    return { success: false, error: "Failed to load documents." };
  }
}

export async function setSelectedChild(studentId: string): Promise<ActionResult> {
  const auth = await requireParent();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    await parentRepository.setSelectedChild(auth.parentId, studentId);
    revalidatePath(PARENT_BASE, "layout");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to switch child." };
  }
}

export async function logDocumentAccess(
  studentId: string | null,
  documentType: string,
  url: string,
): Promise<ActionResult> {
  const auth = await requireParent();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    await parentRepository.logDocumentAccess(auth.parentId, studentId, documentType, url);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to log access." };
  }
}
