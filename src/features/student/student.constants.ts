import type { Role } from "@/constants/roles";

export const STUDENT_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "LEFT", label: "Left" },
  { value: "GRADUATED", label: "Graduated" },
] as const;

export const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
] as const;

export const PARENT_RELATIONSHIP_OPTIONS = [
  { value: "FATHER", label: "Father" },
  { value: "MOTHER", label: "Mother" },
  { value: "GUARDIAN", label: "Guardian" },
] as const;

export const DOCUMENT_TYPE_OPTIONS = [
  { value: "BIRTH_CERTIFICATE", label: "Birth Certificate" },
  { value: "PHOTOGRAPH", label: "Student Photograph" },
  { value: "PREVIOUS_SCHOOL_RECORD", label: "Previous School Record" },
  { value: "TRANSFER_CERTIFICATE", label: "Transfer Certificate" },
  { value: "IDENTITY_PROOF", label: "Identity Proof" },
] as const;

export type StudentStatusValue = (typeof STUDENT_STATUS_OPTIONS)[number]["value"];
export type GenderValue = (typeof GENDER_OPTIONS)[number]["value"];
export type ParentRelationshipValue = (typeof PARENT_RELATIONSHIP_OPTIONS)[number]["value"];
export type DocumentTypeValue = (typeof DOCUMENT_TYPE_OPTIONS)[number]["value"];

/** Aliases used by admission and document components. */
export const STUDENT_GENDER_OPTIONS = GENDER_OPTIONS;
export const STUDENT_RELATIONSHIP_OPTIONS = PARENT_RELATIONSHIP_OPTIONS;
export const STUDENT_DOCUMENT_TYPES = DOCUMENT_TYPE_OPTIONS;

/** Roles that can open the Student Management console. */
export const STUDENT_VIEW_ROLES: Role[] = ["SUPER_ADMIN", "ADMIN", "TEACHER", "PARENT"];

export function canManageStudent(actor: Role | null): boolean {
  return actor === "SUPER_ADMIN" || actor === "ADMIN";
}

export function isTeacherScoped(actor: Role | null): boolean {
  return actor === "TEACHER";
}

export function isParentScoped(actor: Role | null): boolean {
  return actor === "PARENT";
}
