import type { Role } from "@/constants/roles";

export const BATCH_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ARCHIVED", label: "Archived" },
] as const;

export const DAY_OF_WEEK_OPTIONS = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" },
] as const;

export type BatchStatusValue = (typeof BATCH_STATUS_OPTIONS)[number]["value"];
export type DayOfWeekValue = (typeof DAY_OF_WEEK_OPTIONS)[number]["value"];

/** Roles allowed to open the Batch Management console (TEACHER = read assigned only). */
export const BATCH_VIEW_ROLES: Role[] = ["SUPER_ADMIN", "ADMIN", "TEACHER"];

/** SUPER_ADMIN / ADMIN have full control over batches. */
export function canManageBatch(actor: Role | null): boolean {
  return actor === "SUPER_ADMIN" || actor === "ADMIN";
}

/** TEACHER sees only batches they are assigned to. */
export function isTeacherScoped(actor: Role | null): boolean {
  return actor === "TEACHER";
}

export const BATCH_NAV = {
  list: "/dashboard/academic/batch",
} as const;
