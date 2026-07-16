import { z } from "zod";

import {
  ATTENDANCE_STATUS_OPTIONS,
  ASSIGNMENT_STATUS_OPTIONS,
  TEST_STATUS_OPTIONS,
} from "./teacher.constants";

const attendanceStatusEnum = z.enum(ATTENDANCE_STATUS_OPTIONS.map((o) => o.value) as [string, ...string[]]);
const assignmentStatusEnum = z.enum(ASSIGNMENT_STATUS_OPTIONS.map((o) => o.value) as [string, ...string[]]);
const testStatusEnum = z.enum(TEST_STATUS_OPTIONS.map((o) => o.value) as [string, ...string[]]);

export const attendanceDetailSchema = z.object({
  studentId: z.string().min(1),
  status: attendanceStatusEnum,
  remarks: z.string().optional(),
});

export const attendanceFormSchema = z.object({
  batchId: z.string().min(1, "Batch is required"),
  date: z.string().min(1, "Date is required"),
  records: z.array(attendanceDetailSchema).min(1, "At least one student record required"),
});

export type AttendanceFormValues = z.infer<typeof attendanceFormSchema>;

export const assignmentFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  subjectId: z.string().min(1, "Subject is required"),
  batchId: z.string().min(1, "Batch is required"),
  dueDate: z.string().min(1, "Due date is required"),
  maxMarks: z.coerce.number().int().positive().optional().nullable(),
  status: assignmentStatusEnum,
  attachments: z.array(z.instanceof(File)).optional(),
});

export type AssignmentFormValues = z.infer<typeof assignmentFormSchema>;

export const testFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subjectId: z.string().min(1, "Subject is required"),
  batchId: z.string().min(1, "Batch is required"),
  testDate: z.string().min(1, "Test date is required"),
  maxMarks: z.coerce.number().int().positive("Maximum marks must be positive"),
  instructions: z.string().optional(),
  status: testStatusEnum,
});

export type TestFormValues = z.infer<typeof testFormSchema>;

export const marksEntryDetailSchema = z.object({
  studentId: z.string().min(1),
  marksObtained: z.coerce.number().int().nonnegative().nullable(),
  isAbsent: z.boolean(),
  remarks: z.string().optional(),
});

export const marksEntryFormSchema = z.object({
  testId: z.string().min(1, "Test is required"),
  batchId: z.string().min(1, "Batch is required"),
  subjectId: z.string().min(1, "Subject is required"),
  results: z.array(marksEntryDetailSchema).min(1, "At least one student result required"),
});

export type MarksEntryFormValues = z.infer<typeof marksEntryFormSchema>;

export const teacherProfileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  qualification: z.string().optional(),
  specialization: z.string().optional(),
  experienceYears: z.coerce.number().int().nonnegative().optional(),
  photo: z.instanceof(File).optional(),
});

export type TeacherProfileFormValues = z.infer<typeof teacherProfileFormSchema>;