import { prisma } from "@/database/prisma";
import { userRepository } from "@/repositories/user.repository";
import { getCurrentUserId } from "@/lib/auth/current-user";

const DAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as const;

export interface AdminDashboardData {
  adminName: string;
  today: Date;
  sessionName: string | null;
  summary: {
    studentsPresent: number;
    studentsAbsent: number;
    admissionsToday: number;
    collectionToday: number;
    pendingLeaves: number;
  };
  academic: {
    activeClasses: number;
    activeBatches: number;
    teachersTeachingToday: number;
    assignmentsPending: number;
    testsScheduled: number;
  };
  finance: {
    collectionToday: number;
    pendingFees: number;
    overdueStudents: number;
    recentReceipts: RecentReceipt[];
  };
  activity: ActivityItem[];
  events: CalendarEvent[];
}

export interface RecentReceipt {
  id: string;
  receiptNumber: string;
  studentName: string;
  amount: number;
  date: Date;
}

export interface ActivityItem {
  id: string;
  type: "admission" | "attendance" | "payment" | "assignment" | "test";
  title: string;
  detail: string;
  date: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: string;
}

function startOfToday(now: Date): Date {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfToday(now: Date): Date {
  const d = new Date(now);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Runs async tasks with a bounded concurrency so we never open more
 * simultaneous DB connections than the pool allows. Preserves result order.
 */
async function runBatched<const T extends Array<() => Promise<unknown>>>(
  tasks: T,
  limit = 3,
): Promise<{ [K in keyof T]: Awaited<ReturnType<T[K]>> }> {
  const results = new Array(tasks.length) as unknown as {
    [K in keyof T]: Awaited<ReturnType<T[K]>>;
  };
  let cursor = 0;
  async function worker() {
    while (cursor < tasks.length) {
      const index = cursor++;
      const task = tasks[index];
      if (!task) continue;
      (results as unknown as unknown[])[index] = await task();
    }
  }
  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results as { [K in keyof T]: Awaited<ReturnType<T[K]>> };
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const now = new Date();
  const from = startOfToday(now);
  const to = endOfToday(now);
  const todayDay = DAYS[now.getDay()];

  const currentAuthId = await getCurrentUserId();
  const erpUser = currentAuthId ? await userRepository.getByAuthId(currentAuthId) : null;
  const adminName =
    erpUser?.profile?.firstName
      ? `${erpUser.profile.firstName} ${erpUser.profile.lastName ?? ""}`.trim()
      : erpUser?.email ?? "Admin";

  const session = await prisma.academicSession.findFirst({
    where: { status: "ACTIVE", deletedAt: null },
    orderBy: { startDate: "desc" },
    select: { name: true },
  });

  const [
    attendanceAgg,
    admissionsToday,
    collectionTodayAgg,
    pendingLeaves,
    activeClasses,
    activeBatches,
    teachersTeachingToday,
    assignmentsPending,
    testsScheduled,
    financeDash,
    recentReceipts,
    activity,
    events,
  ] = await runBatched([
    () =>
      prisma.attendanceDetail.groupBy({
        by: ["status"],
        where: { attendance: { date: { gte: from, lte: to } } },
        _count: { _all: true },
      }),
    () => prisma.student.count({ where: { admissionDate: { gte: from, lte: to }, deletedAt: null } }),
    () =>
      prisma.feePayment.aggregate({
        where: { paymentDate: { gte: from, lte: to }, deletedAt: null },
        _sum: { amount: true },
      }),
    () => prisma.leaveRequest.count({ where: { status: "PENDING", deletedAt: null } }),
    () => prisma.class.count({ where: { status: "ACTIVE", deletedAt: null } }),
    () => prisma.batch.count({ where: { status: "ACTIVE", deletedAt: null } }),
    () =>
      prisma.batchTeacher.findMany({
        where: {
          unassignedAt: null,
          batch: {
            status: "ACTIVE",
            deletedAt: null,
            schedules: { some: { day: todayDay } },
          },
        },
        select: { teacherId: true },
        distinct: ["teacherId"],
      }),
    () => prisma.assignment.count({ where: { status: "DRAFT", deletedAt: null } }),
    () => prisma.test.count({ where: { status: "SCHEDULED", deletedAt: null } }),
    () =>
      prisma.studentFee.findMany({
        where: { dueAmount: { gt: 0 }, deletedAt: null },
        select: { id: true, studentId: true },
        distinct: ["studentId"],
      }),
    () =>
      prisma.feeReceipt.findMany({
        where: { deletedAt: null },
        orderBy: { generatedAt: "desc" },
        take: 5,
        select: {
          id: true,
          receiptNumber: true,
          totalAmount: true,
          generatedAt: true,
          studentId: true,
        },
      }),
    () => getRecentActivity(from),
    () =>
      prisma.academicCalendar.findMany({
        where: { date: { gte: from }, status: "ACTIVE", deletedAt: null },
        orderBy: { date: "asc" },
        take: 6,
        select: { id: true, title: true, date: true, eventType: true },
      }),
  ]);

  const present =
    attendanceAgg.find((a) => a.status === "PRESENT")?._count._all ?? 0;
  const absent =
    attendanceAgg.find((a) => a.status === "ABSENT")?._count._all ?? 0;

  const overdueStudents = financeDash.length;

  const studentIds = recentReceipts.map((r) => r.studentId).filter(Boolean) as string[];
  const studentNameMap = new Map<string, string>();
  if (studentIds.length > 0) {
    const students = await prisma.student.findMany({
      where: { id: { in: studentIds } },
      select: { id: true, firstName: true, lastName: true },
    });
    students.forEach((s) => studentNameMap.set(s.id, `${s.firstName} ${s.lastName ?? ""}`.trim()));
  }

  return {
    adminName,
    today: now,
    sessionName: session?.name ?? null,
    summary: {
      studentsPresent: present,
      studentsAbsent: absent,
      admissionsToday,
      collectionToday: Number(collectionTodayAgg._sum.amount ?? 0),
      pendingLeaves,
    },
    academic: {
      activeClasses,
      activeBatches,
      teachersTeachingToday: teachersTeachingToday.length,
      assignmentsPending,
      testsScheduled,
    },
    finance: {
      collectionToday: Number(collectionTodayAgg._sum.amount ?? 0),
      pendingFees: overdueStudents,
      overdueStudents,
      recentReceipts: recentReceipts.map((r) => ({
        id: r.id,
        receiptNumber: r.receiptNumber,
        studentName: studentNameMap.get(r.studentId) ?? "Student",
        amount: Number(r.totalAmount),
        date: r.generatedAt,
      })),
    },
    activity,
    events: events.map((e) => ({
      id: e.id,
      title: e.title,
      date: e.date,
      type: e.eventType,
    })),
  };
}

async function getRecentActivity(from: Date): Promise<ActivityItem[]> {
  const [admissions, attendance, payments, assignments, tests] = await runBatched([
    () =>
      prisma.student.findMany({
        where: { admissionDate: { gte: from }, deletedAt: null },
        orderBy: { admissionDate: "desc" },
        take: 4,
        select: { id: true, firstName: true, lastName: true, admissionDate: true },
      }),
    () =>
      prisma.attendance.findMany({
        where: { date: { gte: from } },
        orderBy: { createdAt: "desc" },
        take: 4,
        select: { id: true, date: true, batchId: true },
      }),
    () =>
      prisma.feePayment.findMany({
        where: { paymentDate: { gte: from }, deletedAt: null },
        orderBy: { paymentDate: "desc" },
        take: 4,
        select: { id: true, amount: true, paymentDate: true, studentId: true },
      }),
    () =>
      prisma.assignment.findMany({
        where: { status: "PUBLISHED", deletedAt: null },
        orderBy: { assignedDate: "desc" },
        take: 4,
        select: { id: true, title: true, assignedDate: true },
      }),
    () =>
      prisma.test.findMany({
        where: { status: "PUBLISHED", deletedAt: null },
        orderBy: { testDate: "desc" },
        take: 4,
        select: { id: true, title: true, testDate: true },
      }),
  ]);

  const batchIds = attendance.map((a) => a.batchId).filter(Boolean) as string[];
  const batchNameMap = new Map<string, string>();
  if (batchIds.length > 0) {
    const batches = await prisma.batch.findMany({
      where: { id: { in: batchIds } },
      select: { id: true, name: true },
    });
    batches.forEach((b) => batchNameMap.set(b.id, b.name));
  }

  const payStudentIds = payments.map((p) => p.studentId).filter(Boolean) as string[];
  const payStudentNameMap = new Map<string, string>();
  if (payStudentIds.length > 0) {
    const students = await prisma.student.findMany({
      where: { id: { in: payStudentIds } },
      select: { id: true, firstName: true, lastName: true },
    });
    students.forEach((s) => payStudentNameMap.set(s.id, `${s.firstName} ${s.lastName ?? ""}`.trim()));
  }

  const items: ActivityItem[] = [
    ...admissions.map((s) => ({
      id: `adm-${s.id}`,
      type: "admission" as const,
      title: "Student admitted",
      detail: `${s.firstName} ${s.lastName ?? ""}`.trim(),
      date: s.admissionDate,
    })),
    ...attendance.map((a) => ({
      id: `att-${a.id}`,
      type: "attendance" as const,
      title: "Attendance submitted",
      detail: batchNameMap.get(a.batchId) ?? "Batch",
      date: a.date,
    })),
    ...payments.map((p) => ({
      id: `pay-${p.id}`,
      type: "payment" as const,
      title: "Fee collected",
      detail: `${payStudentNameMap.get(p.studentId) ?? "Student"} · ₹${Number(p.amount).toLocaleString("en-IN")}`,
      date: p.paymentDate,
    })),
    ...assignments.map((a) => ({
      id: `asg-${a.id}`,
      type: "assignment" as const,
      title: "Assignment published",
      detail: a.title,
      date: a.assignedDate,
    })),
    ...tests.map((t) => ({
      id: `tst-${t.id}`,
      type: "test" as const,
      title: "Test published",
      detail: t.title,
      date: t.testDate,
    })),
  ];

  return items.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 8);
}
