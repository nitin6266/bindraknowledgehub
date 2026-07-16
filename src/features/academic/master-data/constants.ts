import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  BookOpen,
  Layers,
  Library,
  Clock,
  Timer,
  Tag,
  CalendarRange,
} from "lucide-react";

import type { Role } from "@/constants/roles";

/**
 * Sprint 3 — Academic Master Data module keys.
 * Each key maps to a Prisma model and a UI route under /dashboard/academic.
 */
export const MASTER_MODULES = [
  "academic-session",
  "class",
  "section",
  "subject",
  "time-slot",
  "batch-timing",
  "batch-type",
  "academic-calendar",
] as const;

export type MasterModuleKey = (typeof MASTER_MODULES)[number];

export function isMasterModule(value: string): value is MasterModuleKey {
  return (MASTER_MODULES as readonly string[]).includes(value);
}

/** Maps a module to the Prisma scalar field used as its display name. */
export const MODULE_NAME_KEY: Record<MasterModuleKey, string> = {
  "academic-session": "name",
  class: "name",
  section: "name",
  subject: "name",
  "time-slot": "name",
  "batch-timing": "name",
  "batch-type": "name",
  "academic-calendar": "title",
};

/** Icon used in navigation for each module. */
export const MODULE_ICON: Record<MasterModuleKey, LucideIcon> = {
  "academic-session": CalendarDays,
  class: BookOpen,
  section: Layers,
  subject: Library,
  "time-slot": Clock,
  "batch-timing": Timer,
  "batch-type": Tag,
  "academic-calendar": CalendarRange,
};

/** Labels for the `SessionStatus` enum (Academic Sessions). */
export const SESSION_STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "ACTIVE", label: "Active" },
  { value: "ARCHIVED", label: "Archived" },
] as const;

/** Labels for the `MasterStatus` enum (all other master entities). */
export const MASTER_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
] as const;

/** Labels for the `CalendarEventType` enum (Academic Calendar). */
export const CALENDAR_EVENT_OPTIONS = [
  { value: "HOLIDAY", label: "Holiday" },
  { value: "EXAM", label: "Exam" },
  { value: "PARENT_MEETING", label: "Parent Meeting" },
  { value: "RESULT", label: "Result" },
  { value: "WORKSHOP", label: "Workshop" },
] as const;

/** Whether `actor` may create/edit/delete academic master data. */
export function canManageAcademic(actor: Role | null): boolean {
  return actor === "SUPER_ADMIN" || actor === "ADMIN";
}

/** Roles permitted to view the Academic Management console (TEACHER = read only). */
export const ACADEMIC_VIEW_ROLES: Role[] = ["SUPER_ADMIN", "ADMIN", "TEACHER"];
