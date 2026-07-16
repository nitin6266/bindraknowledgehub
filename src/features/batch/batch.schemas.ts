import { z } from "zod";

import { BATCH_STATUS_OPTIONS, DAY_OF_WEEK_OPTIONS } from "./batch.constants";
import type { BatchStatusValue, DayOfWeekValue } from "./batch.constants";

const statusEnum = z.enum(BATCH_STATUS_OPTIONS.map((o) => o.value) as [BatchStatusValue, ...BatchStatusValue[]]);
const dayEnum = z.enum(DAY_OF_WEEK_OPTIONS.map((o) => o.value) as [DayOfWeekValue, ...DayOfWeekValue[]]);

export const batchSchema = z
  .object({
    name: z.string().min(1, "Batch name is required"),
    code: z.string().min(1, "Batch code is required"),
    sessionId: z.string().min(1, "Academic session is required"),
    classId: z.string().min(1, "Class is required"),
    sectionId: z.string().optional().or(z.literal("")),
    batchTypeId: z.string().min(1, "Batch type is required"),
    capacity: z.coerce.number().min(0, "Capacity cannot be negative"),
    currentStrength: z.coerce.number().min(0, "Current strength cannot be negative"),
    status: statusEnum,
    description: z.string().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.capacity < data.currentStrength) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["capacity"],
        message: "Capacity cannot be less than current strength.",
      });
    }
  });

export type BatchValues = z.infer<typeof batchSchema>;

export const scheduleSchema = z
  .object({
    day: dayEnum,
    timeSlotId: z.string().optional().or(z.literal("")),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    room: z.string().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.startTime >= data.endTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "End time must be after start time.",
      });
    }
  });

export type ScheduleValues = z.infer<typeof scheduleSchema>;

export const teacherSchema = z.object({
  teacherId: z.string().min(1, "Teacher is required"),
  isPrimary: z.boolean().default(false),
  subjectId: z.string().optional().or(z.literal("")),
});

export type TeacherValues = z.infer<typeof teacherSchema>;

export const subjectSchema = z.object({
  subjectId: z.string().min(1, "Subject is required"),
  teacherId: z.string().optional().or(z.literal("")),
  weeklyHours: z.coerce.number().min(0, "Hours cannot be negative"),
  displayOrder: z.coerce.number().min(0, "Order cannot be negative"),
});

export type SubjectValues = z.infer<typeof subjectSchema>;
