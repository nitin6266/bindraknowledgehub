import type { BatchStatusValue, DayOfWeekValue } from "./batch.constants";

export interface BatchRow {
  id: string;
  name: string;
  code: string;
  sessionId: string;
  classId: string;
  sectionId: string | null;
  batchTypeId: string;
  capacity: number;
  currentStrength: number;
  status: BatchStatusValue;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  sessionName?: string;
  className: string;
  sectionName?: string | null;
  batchTypeName?: string;
  primaryTeacherName?: string | null;
  teacherCount?: number;
  subjectCount?: number;
}

export interface BatchScheduleView {
  id: string;
  day: DayOfWeekValue;
  timeSlotId: string | null;
  timeSlotName?: string | null;
  startTime: string;
  endTime: string;
  room: string | null;
}

export interface BatchTeacherView {
  id: string;
  teacherId: string;
  teacherName: string;
  isPrimary: boolean;
  subjectId: string | null;
  subjectName: string | null;
  assignedAt: string;
  unassignedAt: string | null;
  active: boolean;
}

export interface BatchSubjectView {
  id: string;
  subjectId: string;
  subjectName: string;
  teacherId: string | null;
  teacherName: string | null;
  weeklyHours: number;
  displayOrder: number;
}

export interface BatchDetail extends BatchRow {
  schedules: BatchScheduleView[];
  teachers: BatchTeacherView[];
  subjects: BatchSubjectView[];
}

export interface BatchFormValues {
  name: string;
  code: string;
  sessionId: string;
  classId: string;
  sectionId: string;
  batchTypeId: string;
  capacity: number;
  currentStrength: number;
  status: BatchStatusValue;
  description: string;
}

export interface ScheduleFormValues {
  day: DayOfWeekValue;
  timeSlotId: string;
  startTime: string;
  endTime: string;
  room: string;
}

export interface TeacherFormValues {
  teacherId: string;
  isPrimary: boolean;
  subjectId: string;
}

export interface SubjectFormValues {
  subjectId: string;
  teacherId: string;
  weeklyHours: number;
  displayOrder: number;
}

export interface Option {
  value: string;
  label: string;
}

export interface BatchFilters {
  search?: string;
  sessionId?: string;
  classId?: string;
  teacherId?: string;
  status?: string;
  batchTypeId?: string;
}
