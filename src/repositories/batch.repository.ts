import { prisma } from "@/database/prisma";
import type { Prisma } from "@prisma/client";

import { masterDataRepository } from "@/repositories/master-data.repository";
import { nameKeyFor } from "@/features/academic/master-data/config";
import type { MasterModuleKey } from "@/features/academic/master-data/constants";

import type {
  BatchDetail,
  BatchRow,
  BatchScheduleView,
  BatchSubjectView,
  BatchTeacherView,
  BatchFilters,
  ScheduleFormValues,
  SubjectFormValues,
  TeacherFormValues,
} from "@/features/batch/batch.types";
import type { BatchStatusValue } from "@/features/batch/batch.constants";

interface Scope {
  teacherScopeId?: string;
}

function teacherName(record: { profile?: { firstName: string; lastName: string } | null; email: string }): string {
  const full = `${record.profile?.firstName ?? ""} ${record.profile?.lastName ?? ""}`.trim();
  return full || record.email;
}

async function masterNameMap(module: MasterModuleKey): Promise<Record<string, string>> {
  const rows = await masterDataRepository.list(module);
  const key = nameKeyFor(module);
  const map: Record<string, string> = {};
  for (const r of rows) {
    map[String(r.id)] = String(r[key] ?? "");
  }
  return map;
}

async function teacherNameMap(ids: string[]): Promise<Record<string, string>> {
  const unique = Array.from(new Set(ids.filter(Boolean)));
  if (!unique.length) {
    return {};
  }
  const users = await prisma.user.findMany({
    where: { id: { in: unique }, deletedAt: null },
    include: { profile: true },
  });
  const map: Record<string, string> = {};
  for (const u of users) {
    map[u.id] = teacherName(u);
  }
  return map;
}

export const batchRepository = {
  /** Lightweight id+name list for select options across the app. */
  async listOptions(): Promise<{ id: string; name: string }[]> {
    return prisma.batch.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  },

  async list(filters: BatchFilters = {}, scope: Scope = {}): Promise<BatchRow[]> {
    const where: Prisma.BatchWhereInput = { deletedAt: null };

    if (filters.sessionId) where.sessionId = filters.sessionId;
    if (filters.classId) where.classId = filters.classId;
    if (filters.status) where.status = filters.status as BatchStatusValue;
    if (filters.batchTypeId) where.batchTypeId = filters.batchTypeId;

    const teacherId = filters.teacherId ?? scope.teacherScopeId;
    if (teacherId) {
      where.teachers = { some: { teacherId, unassignedAt: null } };
    }

    if (filters.search) {
      const term = filters.search.trim();
      if (term) {
        where.OR = [
          { name: { contains: term, mode: "insensitive" } },
          { code: { contains: term, mode: "insensitive" } },
        ];
      }
    }

    const batches = await prisma.batch.findMany({
      where,
      include: {
        teachers: { where: { unassignedAt: null }, select: { teacherId: true, isPrimary: true } },
        _count: { select: { subjects: true, schedules: true } },
      },
      orderBy: [{ name: "asc" }],
    });

    const [sessionMap, classMap, sectionMap, batchTypeMap, teacherMap] = await Promise.all([
      masterNameMap("academic-session"),
      masterNameMap("class"),
      masterNameMap("section"),
      masterNameMap("batch-type"),
      teacherNameMap(batches.flatMap((b) => b.teachers.map((t) => t.teacherId))),
    ]);

    return batches.map((b) => {
      const primary = b.teachers.find((t) => t.isPrimary);
      return {
        id: b.id,
        name: b.name,
        code: b.code,
        sessionId: b.sessionId,
        classId: b.classId,
        sectionId: b.sectionId,
        batchTypeId: b.batchTypeId,
        capacity: b.capacity,
        currentStrength: b.currentStrength,
        status: b.status,
        description: b.description,
        createdAt: b.createdAt.toISOString(),
        updatedAt: b.updatedAt.toISOString(),
        deletedAt: b.deletedAt ? b.deletedAt.toISOString() : null,
        sessionName: sessionMap[b.sessionId] ?? "—",
        className: classMap[b.classId] ?? "—",
        sectionName: b.sectionId ? (sectionMap[b.sectionId] ?? "—") : null,
        batchTypeName: batchTypeMap[b.batchTypeId] ?? "—",
        primaryTeacherName: primary ? (teacherMap[primary.teacherId] ?? "—") : null,
        teacherCount: b.teachers.length,
        subjectCount: b._count.subjects,
      };
    });
  },

  async getDetail(id: string): Promise<BatchDetail | null> {
    const batch = await prisma.batch.findUnique({
      where: { id, deletedAt: null },
      include: {
        schedules: { orderBy: [{ day: "asc" }, { startTime: "asc" }] },
        teachers: { orderBy: [{ isPrimary: "desc" }, { assignedAt: "desc" }] },
        subjects: { orderBy: [{ displayOrder: "asc" }] },
        _count: { select: { subjects: true, schedules: true } },
      },
    });
    if (!batch) {
      return null;
    }

    const [sessionMap, classMap, sectionMap, batchTypeMap, subjectMap, timeSlotMap, teacherMap] = await Promise.all([
      masterNameMap("academic-session"),
      masterNameMap("class"),
      masterNameMap("section"),
      masterNameMap("batch-type"),
      masterNameMap("subject"),
      masterNameMap("time-slot"),
      teacherNameMap([
        ...batch.teachers.map((t) => t.teacherId),
        ...batch.subjects.map((s) => s.teacherId).filter((v): v is string => !!v),
      ]),
    ]);

    const schedules: BatchScheduleView[] = batch.schedules.map((s) => ({
      id: s.id,
      day: s.day,
      timeSlotId: s.timeSlotId,
      timeSlotName: s.timeSlotId ? (timeSlotMap[s.timeSlotId] ?? null) : null,
      startTime: s.startTime,
      endTime: s.endTime,
      room: s.room,
    }));

    const teachers: BatchTeacherView[] = batch.teachers.map((t) => ({
      id: t.id,
      teacherId: t.teacherId,
      teacherName: teacherMap[t.teacherId] ?? "—",
      isPrimary: t.isPrimary,
      subjectId: t.subjectId,
      subjectName: t.subjectId ? (subjectMap[t.subjectId] ?? null) : null,
      assignedAt: t.assignedAt.toISOString(),
      unassignedAt: t.unassignedAt ? t.unassignedAt.toISOString() : null,
      active: t.unassignedAt === null,
    }));

    const subjects: BatchSubjectView[] = batch.subjects.map((s) => ({
      id: s.id,
      subjectId: s.subjectId,
      subjectName: subjectMap[s.subjectId] ?? "—",
      teacherId: s.teacherId,
      teacherName: s.teacherId ? (teacherMap[s.teacherId] ?? null) : null,
      weeklyHours: s.weeklyHours,
      displayOrder: s.displayOrder,
    }));

    return {
      id: batch.id,
      name: batch.name,
      code: batch.code,
      sessionId: batch.sessionId,
      classId: batch.classId,
      sectionId: batch.sectionId,
      batchTypeId: batch.batchTypeId,
      capacity: batch.capacity,
      currentStrength: batch.currentStrength,
      status: batch.status,
      description: batch.description,
      createdAt: batch.createdAt.toISOString(),
      updatedAt: batch.updatedAt.toISOString(),
      deletedAt: batch.deletedAt ? batch.deletedAt.toISOString() : null,
      sessionName: sessionMap[batch.sessionId] ?? "—",
      className: classMap[batch.classId] ?? "—",
      sectionName: batch.sectionId ? (sectionMap[batch.sectionId] ?? "—") : null,
      batchTypeName: batchTypeMap[batch.batchTypeId] ?? "—",
      primaryTeacherName: teachers.find((t) => t.isPrimary)?.teacherName ?? null,
      teacherCount: teachers.filter((t) => t.active).length,
      subjectCount: batch._count.subjects,
      schedules,
      teachers,
      subjects,
    };
  },

  async create(values: Record<string, unknown>): Promise<{ id: string }> {
    const created = await prisma.batch.create({ data: values as Prisma.BatchCreateInput, select: { id: true } });
    return created;
  },

  async update(id: string, values: Record<string, unknown>): Promise<void> {
    await prisma.batch.update({ where: { id }, data: values as Prisma.BatchUpdateInput });
  },

  async archive(id: string): Promise<void> {
    await prisma.batch.update({ where: { id }, data: { status: "ARCHIVED" } });
  },

  async softDelete(id: string): Promise<void> {
    await prisma.batch.update({ where: { id }, data: { deletedAt: new Date() } });
  },

  /** Duplicates a batch's configuration with a fresh code and "(Copy)" name. */
  async clone(id: string): Promise<{ id: string }> {
    return prisma.$transaction(async (tx) => {
      const source = await tx.batch.findUnique({ where: { id }, include: { schedules: true, subjects: true } });
      if (!source) {
        throw new Error("Source batch not found.");
      }
      const copy = await tx.batch.create({
        data: {
          name: `${source.name} (Copy)`,
          code: `${source.code}-COPY-${Date.now().toString(36).toUpperCase()}`,
          sessionId: source.sessionId,
          classId: source.classId,
          sectionId: source.sectionId,
          batchTypeId: source.batchTypeId,
          capacity: source.capacity,
          currentStrength: 0,
          status: "INACTIVE",
          description: source.description,
        },
        select: { id: true },
      });

      if (source.schedules.length) {
        await tx.batchSchedule.createMany({
          data: source.schedules.map((s) => ({
            batchId: copy.id,
            day: s.day,
            timeSlotId: s.timeSlotId,
            startTime: s.startTime,
            endTime: s.endTime,
            room: s.room,
          })),
        });
      }

      if (source.subjects.length) {
        await tx.batchSubject.createMany({
          data: source.subjects.map((s) => ({
            batchId: copy.id,
            subjectId: s.subjectId,
            teacherId: s.teacherId,
            weeklyHours: s.weeklyHours,
            displayOrder: s.displayOrder,
          })),
        });
      }

      return { id: copy.id };
    });
  },

  async scheduleOverlaps(batchId: string, day: string, startTime: string, endTime: string): Promise<boolean> {
    const existing = await prisma.batchSchedule.findMany({ where: { batchId, day: day as Prisma.EnumDayOfWeekFilter } });
    return existing.some((s) => startTime < s.endTime && endTime > s.startTime);
  },

  async addSchedule(batchId: string, values: ScheduleFormValues): Promise<void> {
    await prisma.batchSchedule.create({
      data: {
        batchId,
        day: values.day,
        timeSlotId: values.timeSlotId || null,
        startTime: values.startTime,
        endTime: values.endTime,
        room: values.room || null,
      },
    });
  },

  async removeSchedule(batchId: string, scheduleId: string): Promise<void> {
    await prisma.batchSchedule.deleteMany({ where: { id: scheduleId, batchId } });
  },

  async addTeacher(batchId: string, values: TeacherFormValues): Promise<void> {
    await prisma.$transaction(async (tx) => {
      if (values.isPrimary) {
        await tx.batchTeacher.updateMany({ where: { batchId, isPrimary: true }, data: { isPrimary: false } });
      }
      await tx.batchTeacher.create({
        data: {
          batchId,
          teacherId: values.teacherId,
          isPrimary: values.isPrimary ?? false,
          subjectId: values.subjectId || null,
        },
      });
    });
  },

  /** Soft-removes a teacher assignment by recording unassignedAt (keeps history). */
  async removeTeacher(batchId: string, teacherId: string): Promise<void> {
    await prisma.batchTeacher.updateMany({
      where: { batchId, teacherId, unassignedAt: null },
      data: { unassignedAt: new Date() },
    });
  },

  async addSubject(batchId: string, values: SubjectFormValues): Promise<void> {
    await prisma.batchSubject.create({
      data: {
        batchId,
        subjectId: values.subjectId,
        teacherId: values.teacherId || null,
        weeklyHours: values.weeklyHours,
        displayOrder: values.displayOrder,
      },
    });
  },

  async removeSubject(batchId: string, subjectId: string): Promise<void> {
    await prisma.batchSubject.deleteMany({ where: { batchId, subjectId } });
  },
};
