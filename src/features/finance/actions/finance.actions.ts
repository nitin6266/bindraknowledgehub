"use server";

import { revalidatePath } from "next/cache";

import { authorizeAction } from "@/lib/auth/authorize";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { ROLES } from "@/constants/roles";
import { userRepository } from "@/repositories/user.repository";
import { financeRepository } from "@/repositories/finance.repository";
import { batchRepository } from "@/repositories/batch.repository";
import { masterDataRepository } from "@/repositories/master-data.repository";
import type { ActionResult } from "@/features/student/actions/student.actions";
import type { Option } from "@/features/teacher/teacher.types";
import type {
  FeeCategoryData,
  FeeStructureData,
  StudentFeeRow,
  StudentFeeDetail,
  OutstandingDashboard,
  FeeFilters,
  FinanceReports,
  ReceiptData,
} from "@/features/finance/finance.types";
import type {
  FeeCategoryValues,
  FeeStructureValues,
  StudentFeeAssignValues,
  DiscountValues,
  PaymentValues,
} from "@/features/finance/finance.schemas";

type FinanceActionResult<T> = { success: true; data: T } | { success: false; error: string };

const FINANCE_BASE = "/dashboard/finance";

async function requireFinanceManager(): Promise<
  { success: true; actorId: string } | { success: false; error: string }
> {
  const actor = await authorizeAction([ROLES.SUPER_ADMIN, ROLES.ADMIN]);
  if (!actor) {
    return { success: false, error: "You are not authorized to manage finances." };
  }
  const authId = await getCurrentUserId();
  if (!authId) return { success: false, error: "Session expired. Please sign in again." };
  const erpUser = await userRepository.getByAuthId(authId);
  if (!erpUser) return { success: false, error: "Account not found." };
  return { success: true, actorId: erpUser.id };
}

export async function getFeeCategories(): Promise<FinanceActionResult<FeeCategoryData[]>> {
  const auth = await requireFinanceManager();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    const data = await financeRepository.getFeeCategories();
    return { success: true, data };
  } catch {
    return { success: false, error: "Failed to load fee categories." };
  }
}

export async function createFeeCategory(values: FeeCategoryValues): Promise<ActionResult> {
  const auth = await requireFinanceManager();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    await financeRepository.createFeeCategory(values);
    revalidatePath(`${FINANCE_BASE}/categories`);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to create category." };
  }
}

export async function updateFeeCategory(id: string, values: FeeCategoryValues): Promise<ActionResult> {
  const auth = await requireFinanceManager();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    await financeRepository.updateFeeCategory(id, values);
    revalidatePath(`${FINANCE_BASE}/categories`);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update category." };
  }
}

export async function deleteFeeCategory(id: string): Promise<ActionResult> {
  const auth = await requireFinanceManager();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    await financeRepository.deleteFeeCategory(id);
    revalidatePath(`${FINANCE_BASE}/categories`);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete category." };
  }
}

export async function getFeeStructures(
  filters: FeeFilters,
): Promise<FinanceActionResult<FeeStructureData[]>> {
  const auth = await requireFinanceManager();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    const data = await financeRepository.getFeeStructures(filters);
    return { success: true, data };
  } catch {
    return { success: false, error: "Failed to load fee structures." };
  }
}

export async function createFeeStructure(values: FeeStructureValues): Promise<ActionResult> {
  const auth = await requireFinanceManager();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    await financeRepository.createFeeStructure(values);
    revalidatePath(`${FINANCE_BASE}/structures`);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to create structure." };
  }
}

export async function updateFeeStructure(id: string, values: FeeStructureValues): Promise<ActionResult> {
  const auth = await requireFinanceManager();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    await financeRepository.updateFeeStructure(id, values);
    revalidatePath(`${FINANCE_BASE}/structures`);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update structure." };
  }
}

export async function deleteFeeStructure(id: string): Promise<ActionResult> {
  const auth = await requireFinanceManager();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    await financeRepository.deleteFeeStructure(id);
    revalidatePath(`${FINANCE_BASE}/structures`);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete structure." };
  }
}

export async function getStudentFees(
  filters: FeeFilters,
): Promise<FinanceActionResult<StudentFeeRow[]>> {
  const auth = await requireFinanceManager();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    const data = await financeRepository.getStudentFees(filters);
    return { success: true, data };
  } catch {
    return { success: false, error: "Failed to load student fees." };
  }
}

export async function getStudentFeeDetail(id: string): Promise<FinanceActionResult<StudentFeeDetail | null>> {
  const auth = await requireFinanceManager();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    const data = await financeRepository.getStudentFeeDetail(id);
    return { success: true, data };
  } catch {
    return { success: false, error: "Failed to load fee detail." };
  }
}

export async function assignStudentFees(values: StudentFeeAssignValues): Promise<ActionResult> {
  const auth = await requireFinanceManager();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    await financeRepository.assignStudentFees(values);
    revalidatePath(`${FINANCE_BASE}/student-fees`);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to assign fees." };
  }
}

export async function searchStudents(
  query: string,
): Promise<FinanceActionResult<{ id: string; name: string; admissionNumber: string }[]>> {
  const auth = await requireFinanceManager();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    const data = await financeRepository.searchStudents(query);
    return { success: true, data };
  } catch {
    return { success: false, error: "Failed to search students." };
  }
}

export async function createDiscount(values: DiscountValues): Promise<ActionResult> {
  const auth = await requireFinanceManager();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    await financeRepository.createDiscount(values);
    revalidatePath(`${FINANCE_BASE}/student-fees`);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to add discount." };
  }
}

export async function approveDiscount(id: string): Promise<ActionResult> {
  const auth = await requireFinanceManager();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    await financeRepository.approveDiscount(id, auth.actorId);
    revalidatePath(`${FINANCE_BASE}/student-fees`);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to approve discount." };
  }
}

export async function collectPayment(values: PaymentValues): Promise<ActionResult> {
  const auth = await requireFinanceManager();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    await financeRepository.collectPayment(values, auth.actorId);
    revalidatePath(`${FINANCE_BASE}/collection`);
    revalidatePath(`${FINANCE_BASE}/student-fees`);
    revalidatePath(`${FINANCE_BASE}/receipts`);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to record payment." };
  }
}

export async function getReceipt(id: string): Promise<FinanceActionResult<ReceiptData | null>> {
  const auth = await requireFinanceManager();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    const data = await financeRepository.getReceipt(id);
    return { success: true, data };
  } catch {
    return { success: false, error: "Failed to load receipt." };
  }
}

export async function getReceipts(): Promise<FinanceActionResult<ReceiptData[]>> {
  const auth = await requireFinanceManager();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    const data = await financeRepository.listReceipts();
    return { success: true, data };
  } catch {
    return { success: false, error: "Failed to load receipts." };
  }
}

export async function getOutstandingDashboard(): Promise<FinanceActionResult<OutstandingDashboard>> {
  const auth = await requireFinanceManager();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    const data = await financeRepository.getOutstandingDashboard();
    return { success: true, data };
  } catch {
    return { success: false, error: "Failed to load dashboard." };
  }
}

export async function getFinanceReports(
  filters: FeeFilters,
): Promise<FinanceActionResult<FinanceReports>> {
  const auth = await requireFinanceManager();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    const data = await financeRepository.getFinanceReports(filters);
    return { success: true, data };
  } catch {
    return { success: false, error: "Failed to load reports." };
  }
}

export async function getFinanceOptions(): Promise<
  FinanceActionResult<{
    sessions: Option[];
    classes: Option[];
    batches: Option[];
    categories: Option[];
    structures: Option[];
  }>
> {
  const auth = await requireFinanceManager();
  if (!auth.success) return { success: false, error: auth.error };
  try {
    const [sessions, classes, batches, categories, structures] = await Promise.all([
      masterDataRepository.list("academic-session"),
      masterDataRepository.list("class"),
      batchRepository.listOptions(),
      financeRepository.getFeeCategories(),
      financeRepository.getFeeStructures({}),
    ]);
    const sessionOptions = sessions.map((s) => ({ value: String(s.id), label: String(s.name) })) as Option[];
    const classOptions = classes.map((c) => ({ value: String(c.id), label: String(c.name) })) as Option[];
    const batchOptions = batches.map((b) => ({ value: b.id, label: b.name })) as Option[];
    const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name })) as Option[];
    const structureOptions = structures.map(
      (s) => ({ value: s.id, label: `${s.categoryName} · ${s.className}${s.batchName ? ` · ${s.batchName}` : ""} · ₹${s.amount}` }),
    ) as Option[];
    return {
      success: true,
      data: {
        sessions: sessionOptions,
        classes: classOptions,
        batches: batchOptions,
        categories: categoryOptions,
        structures: structureOptions,
      },
    };
  } catch {
    return { success: false, error: "Failed to load options." };
  }
}


