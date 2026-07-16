import { prisma } from "@/database/prisma";
import type { Prisma, DayOfWeek, AttendanceStatus, AssignmentStatus, TestStatus } from "@prisma/client";

import { masterDataRepository } from "@/repositories/master-data.repository";
import { nameKeyFor } from "@/features/academic/master-data/config";
import type { MasterModuleKey } from "@/features/academic/master-data/constants";

import type {
  DashboardStats,
  TodayClass,
  BatchRow,
  StudentRow,
  AttendanceRecord,
  AttendanceDetailRow,
  AssignmentRow,
  AssignmentAttachmentRow,
  TestRow,
  MarksEntryRow,
  TeacherProfileData,
} from "@/features/teacher/teacher.types";

interface Scope {
  teacherScopeId?: string;
}

function fullName(first: string | null, last: string | null): string {
  return `${first ?? ""} ${last ?? ""}`.trim();
}

function todayDayOfWeek(): DayOfWeek {
  const jsDay = new Date().getDay();
  const order: DayOfWeek[] = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];
  return order[(jsDay + 6) % 7]!;
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0]!;
}

async function nameMap(module: MasterModuleKey): Promise<Record<string, string>> {
  const rows = await masterDataRepository.list(module);
  const key = nameKeyFor(module);
  const map: Record<string, string> = {};
  for (const r of rows) {
    map[String(r.id)] = String(r[key] ?? "");
  }
  return map;
}

async function batchNameMap(ids: string[]): Promise<Record<string, string>> {
  const unique = Array.from(new Set(ids.filter(Boolean)));
  if (!unique.length) return {};
  const batches = await prisma.batch.findMany({
    where: { id: { in: unique }, deletedAt: null },
    select: { id: true, name: true },
  });
  const map: Record<string, string> = {};
  for (const b of batches) map[b.id] = b.name;
  return map;
}

async function userNameMap(ids: string[]): Promise<Record<string, string>> {
  const unique = Array.from(new Set(ids.filter(Boolean)));
  if (!unique.length) return {};
  const users = await prisma.user.findMany({
    where: { id: { in: unique }, deletedAt: null },
    include: { profile: true },
  });
  const map: Record<string, string> = {};
  for (const u of users) {
    map[u.id] = fullName(u.profile?.firstName ?? null, u.profile?.lastName ?? null) || u.email;
  }
  return map;
}

export const teacherRepository = {
  async getAssignedBatchIds(teacherId?: string): Promise<string[]> {
    if (!teacherId) return [];
    const assigned = await prisma.batchTeacher.findMany({
      where: { teacherId, unassignedAt: null },
      select: { batchId: true },
    });
    return assigned.map((a) => a.batchId);
  },

  async getDashboardStats(teacherId: string): Promise<DashboardStats> {
    const batchIds = await this.getAssignedBatchIds(teacherId);
    if (!batchIds.length) {
      return {
        todaysClasses: 0,
        upcomingClasses: 0,
        pendingAttendance: 0,
        pendingAssignments: 0,
        pendingTestEvaluations: 0,
      };
    }

    const day = todayDayOfWeek();
    const date = todayStr();

    const [schedules, attendanceToday, assignments, tests] = await Promise.all([
      prisma.batchSchedule.findMany({
        where: { batchId: { in: batchIds }, day },
        select: { id: true },
      }),
      prisma.attendance.findMany({
        where: { batchId: { in: batchIds }, date },
        select: { batchId: true },
      }),
      prisma.assignment.findMany({
        where: { batchId: { in: batchIds }, status: "DRAFT", deletedAt: null },
        select: { id: true },
      }),
      prisma.test.findMany({
        where: { batchId: { in: batchIds }, status: { in: ["CONDUCTED", "GRADED"] }, deletedAt: null },
        select: { id: true },
      }),
    ]);

    const attendedBatches = new Set(attendanceToday.map((a) => a.batchId));

    return {
      todaysClasses: schedules.length,
      upcomingClasses: 0,
      pendingAttendance: Math.max(0, batchIds.length - attendedBatches.size),
      pendingAssignments: assignments.length,
      pendingTestEvaluations: tests.length,
    };
  },

  async getTodayClasses(teacherId: string): Promise<TodayClass[]> {
    const batchIds = await this.getAssignedBatchIds(teacherId);
    if (!batchIds.length) return [];

    const day = todayDayOfWeek();
    const date = todayStr();

    const [schedules, teacherBatches, attendanceToday] = await Promise.all([
      prisma.batchSchedule.findMany({
        where: { batchId: { in: batchIds }, day },
        include: { batch: { select: { id: true, name: true } } },
        orderBy: { startTime: "asc" },
      }),
      prisma.batchTeacher.findMany({
        where: { teacherId, batchId: { in: batchIds }, unassignedAt: null },
        select: { batchId: true, subjectId: true },
      }),
      prisma.attendance.findMany({
        where: { batchId: { in: batchIds }, date },
        select: { batchId: true },
      }),
    ]);

    const subjectByBatch = new Map(teacherBatches.map((t) => [t.batchId, t.subjectId ?? ""]));
    const subjectMap = await nameMap("subject");
    const attendedBatches = new Set(attendanceToday.map((a) => a.batchId));

    return schedules.map((s) => {
      const subjectId = subjectByBatch.get(s.batchId) ?? "";
      return {
        id: s.id,
        batchId: s.batchId,
        subjectId,
        batchName: s.batch?.name ?? "—",
        subjectName: subjectMap[subjectId] ?? "—",
        startTime: s.startTime,
        endTime: s.endTime,
        room: s.room ?? "—",
        attendanceStatus: attendedBatches.has(s.batchId) ? "COMPLETED" : "NOT_TAKEN",
      };
    });
  },

  async listBatches(filters: Record<string, string> = {}, scope: Scope = {}): Promise<BatchRow[]> {
    const teacherId = scope.teacherScopeId;
    const batchIds = await this.getAssignedBatchIds(teacherId);

    if (!batchIds.length) return [];

    const where: Prisma.BatchWhereInput = {
      id: { in: batchIds },
      deletedAt: null,
    };

    if (filters.sessionId) where.sessionId = filters.sessionId;
    if (filters.classId) where.classId = filters.classId;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { code: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const batches = await prisma.batch.findMany({
      where,
      select: {
        id: true,
        name: true,
        code: true,
        sessionId: true,
        classId: true,
        sectionId: true,
        schedules: { select: { day: true, startTime: true, endTime: true, room: true } },
        teachers: { where: { unassignedAt: null }, select: { teacherId: true, isPrimary: true } },
      },
      orderBy: { name: "asc" },
    });

    const [sessionMap, classMap, sectionMap, strengthRows] = await Promise.all([
      nameMap("academic-session"),
      nameMap("class"),
      nameMap("section"),
      prisma.student.groupBy({
        by: ["batchId"],
        where: { batchId: { in: batchIds }, deletedAt: null },
        _count: { _all: true },
      }),
    ]);

    const strengthByBatch = new Map(strengthRows.map((r) => [r.batchId, r._count._all]));
    const day = todayDayOfWeek();

    return batches.map((b) => {
      const todaySched = b.schedules
        .filter((s) => s.day === day)
        .map((s) => `${s.startTime}-${s.endTime}${s.room ? ` (${s.room})` : ""}`)
        .join(", ");

      const myAssignment = b.teachers.find((t) => t.teacherId === teacherId);

      return {
        id: b.id,
        name: b.name,
        code: b.code,
        className: classMap[b.classId] ?? "—",
        sectionName: b.sectionId ? (sectionMap[b.sectionId] ?? null) : null,
        sessionName: sessionMap[b.sessionId] ?? "—",
        strength: strengthByBatch.get(b.id) ?? 0,
        todaysSchedule: todaySched || "No classes today",
        teacherRole: myAssignment?.isPrimary ? "PRIMARY" : "SUBJECT",
      };
    });
  },

  async listStudents(filters: Record<string, string> = {}, scope: Scope = {}): Promise<StudentRow[]> {
    const teacherId = scope.teacherScopeId;
    const batchIds = await this.getAssignedBatchIds(teacherId);

    if (!batchIds.length) return [];

    const where: Prisma.StudentWhereInput = {
      deletedAt: null,
      batchId: { in: batchIds },
    };

    if (filters.batchId) where.batchId = filters.batchId;
    if (filters.classId) where.classId = filters.classId;
    if (filters.sessionId) where.sessionId = filters.sessionId;
    if (filters.search) {
      where.OR = [
        { admissionNumber: { contains: filters.search, mode: "insensitive" } },
        { firstName: { contains: filters.search, mode: "insensitive" } },
        { lastName: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const students = await prisma.student.findMany({
      where,
      select: {
        id: true,
        admissionNumber: true,
        rollNumber: true,
        firstName: true,
        lastName: true,
        status: true,
        batchId: true,
        parents: { where: { isPrimary: true }, take: 1, select: { parentId: true } },
      },
      orderBy: { admissionNumber: "asc" },
    });

    const ids = students.map((s) => s.id);
    const [attendanceDetails, testResults, batchMap, parentUsers] = await Promise.all([
      prisma.attendanceDetail.findMany({
        where: { studentId: { in: ids }, status: { in: ["PRESENT", "ABSENT", "LATE"] } },
        select: { studentId: true, status: true },
      }),
      prisma.testResult.findMany({
        where: { studentId: { in: ids } },
        include: { test: { select: { maxScore: true } } },
        orderBy: { createdAt: "desc" },
      }),
      batchNameMap(Array.from(new Set(students.map((s) => s.batchId).filter(Boolean) as string[]))),
      (async () => {
        const parentIds = students
          .map((s) => s.parents[0]?.parentId)
          .filter(Boolean) as string[];
        return userNameMap(parentIds);
      })(),
    ]);

    const attByStudent = new Map<string, { total: number; present: number }>();
    for (const a of attendanceDetails) {
      const cur = attByStudent.get(a.studentId) ?? { total: 0, present: 0 };
      cur.total += 1;
      if (a.status === "PRESENT") cur.present += 1;
      attByStudent.set(a.studentId, cur);
    }

    const testByStudent = new Map<string, { score: number | null; isAbsent: boolean; maxScore: number | null }>();
    for (const r of testResults) {
      if (!testByStudent.has(r.studentId)) {
        testByStudent.set(r.studentId, {
          score: r.score,
          isAbsent: r.isAbsent,
          maxScore: r.test?.maxScore ?? null,
        });
      }
    }

    return students.map((s) => {
      const att = attByStudent.get(s.id);
      const attendancePercent = att && att.total > 0 ? Math.round((att.present / att.total) * 100) : 0;

      const test = testByStudent.get(s.id);
      let latestTestScore = "—";
      if (test) {
        if (test.isAbsent) latestTestScore = "AB";
        else if (test.score !== null) latestTestScore = `${test.score}/${test.maxScore ?? "—"}`;
      }

      const parentId = s.parents[0]?.parentId;
      const parentName = parentId ? (parentUsers[parentId] ?? null) : null;

      return {
        id: s.id,
        admissionNumber: s.admissionNumber,
        rollNumber: s.rollNumber,
        fullName: fullName(s.firstName, s.lastName),
        parentName,
        attendancePercent,
        latestTestScore,
        status: s.status,
        batchId: s.batchId ?? "—",
        batchName: s.batchId ? (batchMap[s.batchId] ?? "—") : "—",
      };
    });
  },

  async listAttendanceRecords(
    filters: Record<string, string> = {},
    scope: Scope = {},
  ): Promise<AttendanceRecord[]> {
    const teacherId = scope.teacherScopeId;
    const batchIds = await this.getAssignedBatchIds(teacherId);

    if (!batchIds.length) return [];

    const where: Prisma.AttendanceWhereInput = {
      batchId: { in: batchIds },
    };

    if (filters.date) where.date = new Date(filters.date);
    if (filters.batchId) where.batchId = filters.batchId;

    const records = await prisma.attendance.findMany({
      where,
      orderBy: { date: "desc" },
    });

    const [batchMap, teacherMap] = await Promise.all([
      batchNameMap(Array.from(new Set(records.map((r) => r.batchId)))),
      userNameMap(Array.from(new Set(records.map((r) => r.markedBy).filter(Boolean) as string[]))),
    ]);

    return records.map((r) => ({
      id: r.id,
      batchId: r.batchId,
      batchName: batchMap[r.batchId] ?? "—",
      date: r.date.toISOString().split("T")[0]!,
      status: r.status,
      markedBy: teacherMap[r.markedBy] ?? "—",
      createdAt: r.createdAt.toISOString(),
    }));
  },

  async getAttendanceDetail(attendanceId: string): Promise<AttendanceDetailRow[]> {
    const details = await prisma.attendanceDetail.findMany({
      where: { attendanceId },
      orderBy: { createdAt: "asc" },
    });

    const studentIds = Array.from(new Set(details.map((d) => d.studentId)));
    const students = await prisma.student.findMany({
      where: { id: { in: studentIds } },
      select: { id: true, admissionNumber: true, rollNumber: true, firstName: true, lastName: true },
    });
    const studentMap = new Map(students.map((s) => [s.id, s]));

    return details
      .map((d) => {
        const s = studentMap.get(d.studentId);
        return {
          studentId: d.studentId,
          admissionNumber: s?.admissionNumber ?? "—",
          rollNumber: s?.rollNumber ?? null,
          fullName: s ? fullName(s.firstName, s.lastName) : "—",
          status: d.status,
          remarks: d.note,
        };
      })
      .sort((a, b) => a.admissionNumber.localeCompare(b.admissionNumber));
  },

  async upsertAttendance(input: {
    batchId: string;
    date: string;
    markedBy: string;
    records: { studentId: string; status: string; remarks?: string }[];
  }): Promise<{ id: string }> {
    const dateObj = new Date(input.date);

    return prisma.$transaction(async (tx) => {
      const attendance = await tx.attendance.upsert({
        where: { batchId_date: { batchId: input.batchId, date: dateObj } },
        update: { markedBy: input.markedBy },
        create: {
          batchId: input.batchId,
          date: dateObj,
          markedBy: input.markedBy,
        },
        select: { id: true },
      });

      for (const r of input.records) {
        await tx.attendanceDetail.upsert({
          where: { attendanceId_studentId: { attendanceId: attendance.id, studentId: r.studentId } },
          update: { status: r.status as AttendanceStatus, note: r.remarks },
          create: {
            attendanceId: attendance.id,
            studentId: r.studentId,
            status: r.status as AttendanceStatus,
            note: r.remarks,
          },
        });
      }

      return { id: attendance.id };
    });
  },

  async listAssignments(filters: Record<string, string> = {}, scope: Scope = {}): Promise<AssignmentRow[]> {
    const teacherId = scope.teacherScopeId;
    const batchIds = await this.getAssignedBatchIds(teacherId);

    if (!batchIds.length) return [];

    const where: Prisma.AssignmentWhereInput = {
      batchId: { in: batchIds },
      deletedAt: null,
    };

    if (filters.batchId) where.batchId = filters.batchId;
    if (filters.subjectId) where.subjectId = filters.subjectId;
    if (filters.status) where.status = filters.status as AssignmentStatus;
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const assignments = await prisma.assignment.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        subjectId: true,
        batchId: true,
        dueDate: true,
        maxScore: true,
        status: true,
        teacherId: true,
        _count: { select: { attachments: true } },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const [subjectMap, batchMap, teacherMap] = await Promise.all([
      nameMap("subject"),
      batchNameMap(Array.from(new Set(assignments.map((a) => a.batchId)))),
      userNameMap(Array.from(new Set(assignments.map((a) => a.teacherId).filter(Boolean) as string[]))),
    ]);

    return assignments.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      subjectId: a.subjectId,
      subjectName: subjectMap[a.subjectId] ?? "—",
      batchId: a.batchId,
      batchName: batchMap[a.batchId] ?? "—",
      dueDate: a.dueDate.toISOString().split("T")[0]!,
      maxMarks: a.maxScore ?? null,
      status: a.status,
      attachmentsCount: a._count.attachments,
      createdAt: a.createdAt.toISOString(),
      createdBy: teacherMap[a.teacherId] ?? "—",
    }));
  },

  async getAssignmentAttachments(assignmentId: string): Promise<AssignmentAttachmentRow[]> {
    const attachments = await prisma.assignmentAttachment.findMany({
      where: { assignmentId },
      orderBy: { uploadedAt: "desc" },
    });

    return attachments.map((a) => ({
      id: a.id,
      fileName: a.fileName,
      fileUrl: a.fileUrl,
      fileType: "",
    }));
  },

  async createAssignment(input: {
    title: string;
    description?: string;
    subjectId: string;
    batchId: string;
    dueDate: Date;
    maxScore?: number | null;
    status: string;
    teacherId: string;
  }): Promise<{ id: string }> {
    const assignment = await prisma.assignment.create({
      data: {
        title: input.title,
        description: input.description,
        subjectId: input.subjectId,
        batchId: input.batchId,
        dueDate: input.dueDate,
        maxScore: input.maxScore,
        status: input.status as AssignmentStatus,
        teacherId: input.teacherId,
      },
      select: { id: true },
    });

    return { id: assignment.id };
  },

  async addAttachment(input: {
    assignmentId: string;
    fileName: string;
    fileUrl: string;
    storagePath: string;
  }): Promise<void> {
    await prisma.assignmentAttachment.create({
      data: {
        assignmentId: input.assignmentId,
        fileName: input.fileName,
        fileUrl: input.fileUrl,
        storagePath: input.storagePath,
      },
    });
  },

  async updateAssignment(id: string, data: Partial<Prisma.AssignmentUpdateInput>): Promise<void> {
    await prisma.assignment.update({ where: { id }, data });
  },

  async listTests(filters: Record<string, string> = {}, scope: Scope = {}): Promise<TestRow[]> {
    const teacherId = scope.teacherScopeId;
    const batchIds = await this.getAssignedBatchIds(teacherId);

    if (!batchIds.length) return [];

    const where: Prisma.TestWhereInput = {
      batchId: { in: batchIds },
      deletedAt: null,
    };

    if (filters.batchId) where.batchId = filters.batchId;
    if (filters.subjectId) where.subjectId = filters.subjectId;
    if (filters.status) where.status = filters.status as TestStatus;
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const tests = await prisma.test.findMany({
      where,
      select: {
        id: true,
        title: true,
        subjectId: true,
        batchId: true,
        testDate: true,
        maxScore: true,
        status: true,
        teacherId: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const [subjectMap, batchMap, teacherMap] = await Promise.all([
      nameMap("subject"),
      batchNameMap(Array.from(new Set(tests.map((t) => t.batchId)))),
      userNameMap(Array.from(new Set(tests.map((t) => t.teacherId).filter(Boolean) as string[]))),
    ]);

    return tests.map((t) => ({
      id: t.id,
      title: t.title,
      subjectId: t.subjectId,
      subjectName: subjectMap[t.subjectId] ?? "—",
      batchId: t.batchId,
      batchName: batchMap[t.batchId] ?? "—",
      testDate: t.testDate.toISOString().split("T")[0]!,
      maxMarks: t.maxScore,
      status: t.status,
      createdAt: t.createdAt.toISOString(),
      createdBy: teacherMap[t.teacherId] ?? "—",
    }));
  },

  async createTest(input: {
    title: string;
    subjectId: string;
    batchId: string;
    testDate: Date;
    maxScore: number;
    description?: string;
    status: string;
    teacherId: string;
  }): Promise<{ id: string }> {
    const test = await prisma.test.create({
      data: {
        title: input.title,
        subjectId: input.subjectId,
        batchId: input.batchId,
        testDate: input.testDate,
        maxScore: input.maxScore,
        description: input.description,
        status: input.status as TestStatus,
        teacherId: input.teacherId,
      },
      select: { id: true },
    });

    return { id: test.id };
  },

  async updateTest(id: string, data: Partial<Prisma.TestUpdateInput>): Promise<void> {
    await prisma.test.update({ where: { id }, data });
  },

  async getMarksEntryData(
    testId: string,
  ): Promise<{ test: { id: string; title: string; maxScore: number; batchId: string; subjectId: string }; students: MarksEntryRow[] }> {
    const test = await prisma.test.findUnique({
      where: { id: testId },
      select: { id: true, title: true, maxScore: true, batchId: true, subjectId: true },
    });
    if (!test) throw new Error("Test not found");

    const students = await prisma.student.findMany({
      where: { batchId: test.batchId, deletedAt: null },
      select: {
        id: true,
        admissionNumber: true,
        rollNumber: true,
        firstName: true,
        lastName: true,
      },
      orderBy: { admissionNumber: "asc" },
    });

    const results = await prisma.testResult.findMany({
      where: { testId, studentId: { in: students.map((s) => s.id) } },
      select: { studentId: true, score: true, isAbsent: true, note: true },
    });
    const resultByStudent = new Map(results.map((r) => [r.studentId, r]));

    return {
      test: { ...test, maxScore: test.maxScore },
      students: students.map((s) => {
        const result = resultByStudent.get(s.id);
        return {
          studentId: s.id,
          admissionNumber: s.admissionNumber,
          rollNumber: s.rollNumber,
          fullName: fullName(s.firstName, s.lastName),
          marksObtained: result?.score ?? null,
          isAbsent: result?.isAbsent ?? false,
          remarks: result?.note ?? "",
        };
      }),
    };
  },

  async upsertTestResults(input: {
    testId: string;
    results: { studentId: string; marksObtained: number | null; isAbsent: boolean; remarks?: string }[];
    gradedBy: string;
  }): Promise<number> {
    return prisma.$transaction(async (tx) => {
      let count = 0;
      for (const r of input.results) {
        await tx.testResult.upsert({
          where: { testId_studentId: { testId: input.testId, studentId: r.studentId } },
          update: {
            score: r.isAbsent ? null : r.marksObtained,
            isAbsent: r.isAbsent,
            note: r.remarks,
          },
          create: {
            testId: input.testId,
            studentId: r.studentId,
            score: r.isAbsent ? null : r.marksObtained,
            isAbsent: r.isAbsent,
            note: r.remarks,
          },
        });
        count++;
      }
      await tx.test.update({
        where: { id: input.testId },
        data: { status: "GRADED" },
      });
      return count;
    });
  },

  async getTeacherProfile(teacherId: string): Promise<TeacherProfileData | null> {
    const user = await prisma.user.findUnique({
      where: { id: teacherId },
      include: { profile: true },
    });
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      firstName: user.profile?.firstName ?? "",
      lastName: user.profile?.lastName ?? "",
      phone: user.profile?.phone ?? null,
      photoUrl: user.profile?.photoUrl ?? null,
      qualification: null,
      specialization: null,
      experienceYears: null,
    };
  },

  async updateTeacherProfile(
    teacherId: string,
    data: {
      firstName: string;
      lastName: string;
      phone?: string | null;
      qualification?: string | null;
      specialization?: string | null;
      experienceYears?: number | null;
      photoUrl?: string | null;
    },
  ): Promise<void> {
    await prisma.user.update({
      where: { id: teacherId },
      data: {
        profile: {
          upsert: {
            create: {
              firstName: data.firstName,
              lastName: data.lastName,
              phone: data.phone,
              photoUrl: data.photoUrl,
            },
            update: {
              firstName: data.firstName,
              lastName: data.lastName,
              phone: data.phone,
              photoUrl: data.photoUrl,
            },
          },
        },
      },
    });
  },
};
