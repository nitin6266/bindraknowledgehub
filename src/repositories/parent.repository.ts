import { prisma } from "@/database/prisma";
import type { Prisma } from "@prisma/client";

import { masterDataRepository } from "@/repositories/master-data.repository";
import { nameKeyFor } from "@/features/academic/master-data/config";
import type { MasterModuleKey } from "@/features/academic/master-data/constants";

import type {
  ParentProfileData,
  ChildSummary,
  ParentDashboardStats,
  AttendanceDayView,
  AssignmentView,
  TestResultView,
  LeaveRequestRow,
  AnnouncementRow,
  DocumentItem,
  LeaveStatusValue,
} from "@/features/parent/parent.types";
import type { LeaveRequestValues, ParentProfileValues } from "@/features/parent/parent.schemas";

function fullName(first: string | null, last: string | null): string {
  return `${first ?? ""} ${last ?? ""}`.trim();
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

function startOfMonth(year: number, month: number): Date {
  return new Date(Date.UTC(year, month - 1, 1));
}

function endOfMonth(year: number, month: number): Date {
  return new Date(Date.UTC(year, month, 0, 23, 59, 59));
}

export const parentRepository = {
  async getParentStudentIds(parentId: string): Promise<string[]> {
    const links = await prisma.studentParent.findMany({
      where: { parentId },
      select: { studentId: true },
    });
    return links.map((l) => l.studentId);
  },

  async getChildrenSummaries(parentId: string): Promise<ChildSummary[]> {
    const studentIds = await this.getParentStudentIds(parentId);
    if (!studentIds.length) return [];

    const students = await prisma.student.findMany({
      where: { id: { in: studentIds }, deletedAt: null },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        admissionNumber: true,
        gender: true,
        photoUrl: true,
        classId: true,
        sectionId: true,
        batchId: true,
      },
    });

    const classNames = await nameMap("class");
    const sectionNames = await nameMap("section");
    const batchNames = await batchNameMap(students.map((s) => s.batchId).filter((b): b is string => Boolean(b)));

    const summaries = await Promise.all(
      students.map(async (s) => {
        const attendance = await this.getAttendanceSummary(s.id);
        return {
          id: s.id,
          name: fullName(s.firstName, s.lastName) || s.admissionNumber,
          admissionNo: s.admissionNumber,
          className: s.classId ? classNames[s.classId] ?? "—" : "—",
          sectionName: s.sectionId ? sectionNames[s.sectionId] ?? "—" : "—",
          batchName: s.batchId ? batchNames[s.batchId] ?? "—" : "—",
          batchId: s.batchId ?? "",
          gender: s.gender ?? "—",
          photoUrl: s.photoUrl ?? null,
          attendance,
        } satisfies ChildSummary;
      }),
    );

    return summaries;
  },

  async getAttendanceSummary(studentId: string): Promise<ChildSummary["attendance"]> {
    const grouped = await prisma.attendanceDetail.groupBy({
      by: ["status"],
      where: { studentId },
      _count: { _all: true },
    });
    let present = 0;
    let absent = 0;
    let late = 0;
    for (const g of grouped) {
      if (g.status === "PRESENT") present = g._count._all;
      else if (g.status === "ABSENT") absent = g._count._all;
      else if (g.status === "LATE") late = g._count._all;
    }
    const total = present + absent + late;
    const percentage = total ? Math.round(((present + late) / total) * 100) : 0;
    return { present, absent, late, total, percentage };
  },

  async getAttendanceDays(
    studentId: string,
    year: number,
    month: number,
  ): Promise<AttendanceDayView[]> {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { batchId: true },
    });
    if (!student?.batchId) return [];

    const start = startOfMonth(year, month);
    const end = endOfMonth(year, month);

    const attendances = await prisma.attendance.findMany({
      where: { batchId: student.batchId, date: { gte: start, lte: end } },
      select: { id: true, date: true },
    });
    if (!attendances.length) return [];

    const details = await prisma.attendanceDetail.findMany({
      where: { attendanceId: { in: attendances.map((a) => a.id) }, studentId },
      select: { attendanceId: true, status: true },
    });

    const dateById: Record<string, string> = {};
    for (const a of attendances) dateById[a.id] = a.date.toISOString().split("T")[0]!;

    return details
      .map((d) => ({
        date: dateById[d.attendanceId] ?? "",
        status: d.status as AttendanceDayView["status"],
      }))
      .filter((v) => v.date)
      .sort((a, b) => a.date.localeCompare(b.date));
  },

  async getTodayStatusForStudents(
    studentIds: string[],
  ): Promise<Record<string, "PRESENT" | "ABSENT" | "LATE" | "NONE">> {
    const result: Record<string, "PRESENT" | "ABSENT" | "LATE" | "NONE"> = {};
    for (const id of studentIds) result[id] = "NONE";
    if (!studentIds.length) return result;

    const students = await prisma.student.findMany({
      where: { id: { in: studentIds }, deletedAt: null },
      select: { id: true, batchId: true },
    });
    const batchIds = Array.from(
      new Set(students.map((s) => s.batchId).filter((b): b is string => Boolean(b))),
    );
    if (!batchIds.length) return result;

    const now = new Date();
    const dayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000 - 1);

    const attendances = await prisma.attendance.findMany({
      where: { batchId: { in: batchIds }, date: { gte: dayStart, lte: dayEnd } },
      select: { id: true },
    });
    if (!attendances.length) return result;

    const details = await prisma.attendanceDetail.findMany({
      where: { attendanceId: { in: attendances.map((a) => a.id) }, studentId: { in: studentIds } },
      select: { studentId: true, status: true },
    });
    for (const d of details) {
      if (d.studentId in result) {
        result[d.studentId] = d.status as "PRESENT" | "ABSENT" | "LATE" | "NONE";
      }
    }
    return result;
  },

  async getAssignmentsForStudent(studentId: string): Promise<AssignmentView[]> {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { batchId: true },
    });
    if (!student?.batchId) return [];

    const subjectNames = await nameMap("subject");

    const assignments = await prisma.assignment.findMany({
      where: { batchId: student.batchId, deletedAt: null },
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
      include: {
        attachments: { select: { id: true, fileName: true, fileUrl: true } },
      },
    });

    return assignments.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description ?? "",
      dueDate: a.dueDate ? a.dueDate.toISOString().split("T")[0]! : null,
      subjectName: a.subjectId ? subjectNames[a.subjectId] ?? "—" : "—",
      batchName: "—",
      attachments: a.attachments.map((at) => ({
        id: at.id,
        fileName: at.fileName,
        fileUrl: at.fileUrl,
      })),
      isSubmitted: false,
    }));
  },

  async getTestResultsForStudent(studentId: string): Promise<TestResultView[]> {
    const results = await prisma.testResult.findMany({
      where: { studentId },
      select: { id: true, testId: true, score: true, note: true, isAbsent: true },
    });
    if (!results.length) return [];

    const subjectNames = await nameMap("subject");
    const testIds = results.map((r) => r.testId);
    const tests = await prisma.test.findMany({
      where: { id: { in: testIds }, deletedAt: null },
      select: { id: true, title: true, subjectId: true, maxScore: true, testDate: true },
    });
    const testMap: Record<string, (typeof tests)[number]> = {};
    for (const t of tests) testMap[t.id] = t;

    return results.map((r) => {
      const t = testMap[r.testId];
      const max = t?.maxScore ?? 0;
      const score = r.score ?? null;
      const percentage = score != null && max > 0 ? Math.round((score / max) * 100) : null;
      return {
        id: r.id,
        testName: t?.title ?? "Test",
        subjectName: t?.subjectId ? subjectNames[t.subjectId] ?? "—" : "—",
        maxScore: max,
        score,
        percentage,
        isAbsent: r.isAbsent,
        note: r.note ?? null,
        testDate: t?.testDate ? t.testDate.toISOString().split("T")[0]! : null,
      } satisfies TestResultView;
    });
  },

  async listLeaveRequests(parentId: string): Promise<LeaveRequestRow[]> {
    const leaves = await prisma.leaveRequest.findMany({
      where: { parentId, deletedAt: null },
      orderBy: { fromDate: "desc" },
    });
    const studentIds = Array.from(new Set(leaves.map((l) => l.studentId)));
    const students = await prisma.student.findMany({
      where: { id: { in: studentIds }, deletedAt: null },
      select: { id: true, firstName: true, lastName: true, admissionNumber: true },
    });
    const nameById: Record<string, string> = {};
    for (const s of students) {
      nameById[s.id] = fullName(s.firstName, s.lastName) || s.admissionNumber;
    }

    return leaves.map((l) => ({
      id: l.id,
      studentId: l.studentId,
      studentName: nameById[l.studentId] ?? "—",
      fromDate: l.fromDate.toISOString().split("T")[0]!,
      toDate: l.toDate.toISOString().split("T")[0]!,
      reason: l.reason,
      status: l.status as LeaveStatusValue,
      reviewNote: l.reviewNote ?? null,
      attachmentUrl: l.attachmentUrl ?? null,
      createdAt: l.createdAt.toISOString().split("T")[0]!,
    }));
  },

  async createLeaveRequest(values: LeaveRequestValues, parentId: string): Promise<string> {
    const created = await prisma.leaveRequest.create({
      data: {
        studentId: values.studentId,
        parentId,
        fromDate: new Date(values.fromDate),
        toDate: new Date(values.toDate),
        reason: values.reason,
        attachmentUrl: values.attachmentUrl || null,
        status: "PENDING",
      },
    });
    return created.id;
  },

  async updateLeaveRequest(
    id: string,
    values: LeaveRequestValues,
    parentId: string,
  ): Promise<void> {
    await prisma.leaveRequest.updateMany({
      where: { id, parentId, deletedAt: null, status: "PENDING" },
      data: {
        studentId: values.studentId,
        fromDate: new Date(values.fromDate),
        toDate: new Date(values.toDate),
        reason: values.reason,
        attachmentUrl: values.attachmentUrl || null,
      },
    });
  },

  async cancelLeaveRequest(id: string, parentId: string): Promise<void> {
    await prisma.leaveRequest.updateMany({
      where: { id, parentId, deletedAt: null },
      data: { status: "CANCELLED" },
    });
  },

  async listAnnouncements(batchIds: string[]): Promise<AnnouncementRow[]> {
    const where: Prisma.AnnouncementWhereInput = {
      deletedAt: null,
      status: "PUBLISHED",
      OR: [{ audience: "ALL" }, { audience: "BATCH", batchId: { in: batchIds } }],
    };
    const announcements = await prisma.announcement.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: 50,
    });
    const publishedByIds = announcements.map((a) => a.publishedById);
    const names = await userNameMap(publishedByIds);
    const batchNames = await batchNameMap(
      announcements.map((a) => a.batchId).filter((b): b is string => Boolean(b)),
    );

    return announcements.map((a) => ({
      id: a.id,
      title: a.title,
      body: a.body,
      audience: a.audience,
      batchName: a.batchId ? batchNames[a.batchId] ?? null : null,
      publishedByName: names[a.publishedById] ?? "School",
      publishedAt: a.publishedAt.toISOString().split("T")[0]!,
    }));
  },

  async getDocuments(studentIds: string[]): Promise<DocumentItem[]> {
    if (!studentIds.length) return [];
    const students = await prisma.student.findMany({
      where: { id: { in: studentIds }, deletedAt: null },
      select: { id: true, batchId: true, firstName: true, lastName: true, admissionNumber: true },
    });
    const nameById: Record<string, string> = {};
    for (const s of students) {
      nameById[s.id] = fullName(s.firstName, s.lastName) || s.admissionNumber;
    }
    const batchIds = Array.from(
      new Set(students.map((s) => s.batchId).filter((b): b is string => Boolean(b))),
    );
    if (!batchIds.length) return [];

    const assignments = await prisma.assignment.findMany({
      where: { batchId: { in: batchIds }, deletedAt: null },
      include: { attachments: { select: { id: true, fileName: true, fileUrl: true } } },
    });

    const items: DocumentItem[] = [];
    for (const a of assignments) {
      const student = students.find((s) => s.batchId === a.batchId);
      const studentId = student?.id ?? studentIds[0]!;
      for (const at of a.attachments) {
        items.push({
          id: at.id,
          title: `${a.title} — ${at.fileName}`,
          type: "Assignment",
          url: at.fileUrl,
          studentId,
          studentName: nameById[studentId] ?? "—",
        });
      }
    }
    return items;
  },

  async logDocumentAccess(
    parentId: string,
    studentId: string | null,
    documentType: string,
    url: string,
  ): Promise<void> {
    await prisma.documentAccessLog.create({
      data: {
        parentId,
        studentId: studentId ?? undefined,
        documentType,
        documentUrl: url,
      },
    });
  },

  async getParentProfile(parentId: string): Promise<ParentProfileData | null> {
    const user = await prisma.user.findUnique({
      where: { id: parentId, deletedAt: null },
      include: { profile: true },
    });
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      firstName: user.profile?.firstName ?? "",
      lastName: user.profile?.lastName ?? "",
      phone: user.profile?.phone ?? "",
      gender: user.profile?.gender ?? "",
      photoUrl: user.profile?.photoUrl ?? null,
    };
  },

  async updateParentProfile(parentId: string, values: ParentProfileValues): Promise<void> {
    const existing = await prisma.userProfile.findUnique({ where: { userId: parentId } });
    if (existing) {
      await prisma.userProfile.update({
        where: { userId: parentId },
        data: {
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          gender: values.gender || null,
        },
      });
    } else {
      await prisma.userProfile.create({
        data: {
          userId: parentId,
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          gender: values.gender || null,
        },
      });
    }
  },

  async getSelectedChild(parentId: string): Promise<string | null> {
    const pref = await prisma.parentPreference.findUnique({ where: { parentId } });
    return pref?.selectedChildId ?? null;
  },

  async setSelectedChild(parentId: string, studentId: string): Promise<void> {
    await prisma.parentPreference.upsert({
      where: { parentId },
      update: { selectedChildId: studentId },
      create: { parentId, selectedChildId: studentId, preferences: "{}" },
    });
  },

  async getDashboardStats(
    parentId: string,
    studentIds: string[],
    studentBatchIds: string[],
  ): Promise<ParentDashboardStats> {
    if (!studentIds.length) {
      return {
        childrenCount: 0,
        presentToday: 0,
        absentToday: 0,
        pendingLeaves: 0,
        pendingAssignments: 0,
        unreadAnnouncements: 0,
      };
    }

    const todayStatus = await this.getTodayStatusForStudents(studentIds);
    let presentToday = 0;
    let absentToday = 0;
    for (const id of studentIds) {
      const status = todayStatus[id];
      if (status === "PRESENT" || status === "LATE") presentToday++;
      else if (status === "ABSENT") absentToday++;
    }

    const [pendingLeaves, assignments, announcements] = await Promise.all([
      prisma.leaveRequest.count({
        where: { parentId, deletedAt: null, status: "PENDING" },
      }),
      prisma.assignment.count({
        where: {
          batchId: { in: studentBatchIds },
          deletedAt: null,
          status: "PUBLISHED",
          dueDate: { gte: new Date() },
        },
      }),
      prisma.announcement.count({
        where: {
          deletedAt: null,
          status: "PUBLISHED",
          OR: [{ audience: "ALL" }, { audience: "BATCH", batchId: { in: studentBatchIds } }],
        },
      }),
    ]);

    return {
      childrenCount: studentIds.length,
      presentToday,
      absentToday,
      pendingLeaves,
      pendingAssignments: assignments,
      unreadAnnouncements: announcements,
    };
  },
};
