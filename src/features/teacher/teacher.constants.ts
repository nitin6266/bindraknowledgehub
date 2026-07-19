import type { Role } from "@/constants/roles";

export const ATTENDANCE_STATUS_OPTIONS = [
  { value: "PRESENT", label: "Present" },
  { value: "ABSENT", label: "Absent" },
  { value: "LATE", label: "Late" },
  { value: "EXCUSED", label: "Excused (Leave)" },
] as const;

export const ASSIGNMENT_STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "CLOSED", label: "Closed" },
] as const;

export const TEST_STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "CONDUCTED", label: "Conducted" },
  { value: "GRADED", label: "Graded" },
  { value: "PUBLISHED", label: "Published" },
] as const;

export type AttendanceStatusValue = (typeof ATTENDANCE_STATUS_OPTIONS)[number]["value"];
export type AssignmentStatusValue = (typeof ASSIGNMENT_STATUS_OPTIONS)[number]["value"];
export type TestStatusValue = (typeof TEST_STATUS_OPTIONS)[number]["value"];

export function isTeacherScoped(role: Role | null): boolean {
  return role === "TEACHER";
}