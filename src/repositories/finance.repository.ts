import { prisma } from "@/database/prisma";
import { Prisma } from "@prisma/client";

import { masterDataRepository } from "@/repositories/master-data.repository";
import { nameKeyFor } from "@/features/academic/master-data/config";
import type { MasterModuleKey } from "@/features/academic/master-data/constants";

import type {
  FeeCategoryData,
  FeeStructureData,
  StudentFeeRow,
  StudentFeeDetail,
  InstallmentRow,
  DiscountRow,
  PaymentRow,
  ReceiptData,
  LedgerRow,
  OutstandingDashboard,
  FeeFilters,
  FinanceReports,
} from "@/features/finance/finance.types";
import type {
  FeeCategoryValues,
  FeeStructureValues,
  StudentFeeAssignValues,
  DiscountValues,
  PaymentValues,
} from "@/features/finance/finance.schemas";
import { ACADEMY_INFO } from "@/features/finance/finance.constants";

function fullName(first: string | null, last: string | null): string {
  return `${first ?? ""} ${last ?? ""}`.trim();
}

function toNum(d: Prisma.Decimal | null | undefined): number {
  if (d == null) return 0;
  return Number(d.toString());
}

function dec(v: number | string): Prisma.Decimal {
  return new Prisma.Decimal(v);
}

async function nameMap(module: MasterModuleKey): Promise<Record<string, string>> {
  const rows = await masterDataRepository.list(module);
  const key = nameKeyFor(module);
  const map: Record<string, string> = {};
  for (const r of rows) map[String(r.id)] = String(r[key] ?? "");
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

async function categoryNameMap(ids: string[]): Promise<Record<string, string>> {
  const unique = Array.from(new Set(ids.filter(Boolean)));
  if (!unique.length) return {};
  const cats = await prisma.feeCategory.findMany({
    where: { id: { in: unique }, deletedAt: null },
    select: { id: true, name: true },
  });
  const map: Record<string, string> = {};
  for (const c of cats) map[c.id] = c.name;
  return map;
}

async function studentBasicMap(
  ids: string[],
): Promise<Record<string, { name: string; admissionNumber: string; classId: string; batchId: string | null }>> {
  const unique = Array.from(new Set(ids.filter(Boolean)));
  if (!unique.length) return {};
  const students = await prisma.student.findMany({
    where: { id: { in: unique }, deletedAt: null },
    select: { id: true, firstName: true, lastName: true, admissionNumber: true, classId: true, batchId: true },
  });
  const map: Record<string, { name: string; admissionNumber: string; classId: string; batchId: string | null }> = {};
  for (const s of students) {
    map[s.id] = {
      name: fullName(s.firstName, s.lastName) || s.admissionNumber,
      admissionNumber: s.admissionNumber,
      classId: s.classId,
      batchId: s.batchId,
    };
  }
  return map;
}

function applyBalance(fee: {
  totalAmount: Prisma.Decimal;
  discountAmount: Prisma.Decimal;
  paidAmount: Prisma.Decimal;
  status: string;
}): { dueAmount: number; status: string } {
  const total = toNum(fee.totalAmount);
  const discount = toNum(fee.discountAmount);
  const paid = toNum(fee.paidAmount);
  const due = Math.max(0, total - discount - paid);
  let status = fee.status;
  if (status !== "WAIVED") {
    if (due <= 0) status = "PAID";
    else if (paid > 0) status = "PARTIAL";
    else status = "PENDING";
  }
  return { dueAmount: due, status };
}

export const financeRepository = {
  // ---- Fee Categories ----
  async getFeeCategories(): Promise<FeeCategoryData[]> {
    const cats = await prisma.feeCategory.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
    });
    return cats.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      status: c.status,
    }));
  },

  async createFeeCategory(values: FeeCategoryValues): Promise<string> {
    const created = await prisma.feeCategory.create({
      data: { name: values.name.trim(), description: values.description || null, status: values.status },
    });
    return created.id;
  },

  async updateFeeCategory(id: string, values: FeeCategoryValues): Promise<void> {
    await prisma.feeCategory.update({
      where: { id },
      data: { name: values.name.trim(), description: values.description || null, status: values.status },
    });
  },

  async deleteFeeCategory(id: string): Promise<void> {
    await prisma.feeCategory.update({ where: { id }, data: { deletedAt: new Date() } });
  },

  // ---- Fee Structures ----
  async getFeeStructures(filters: FeeFilters): Promise<FeeStructureData[]> {
    const where: Prisma.FeeStructureWhereInput = { deletedAt: null };
    if (filters.sessionId) where.sessionId = filters.sessionId;
    if (filters.classId) where.classId = filters.classId;
    if (filters.batchId) where.batchId = filters.batchId;
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.status) where.status = filters.status;

    const structures = await prisma.feeStructure.findMany({
      where,
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
    });

    const [classNames, batchNames, categoryNames, sessionNames] = await Promise.all([
      nameMap("class"),
      batchNameMap(structures.map((s) => s.batchId ?? "").filter(Boolean)),
      categoryNameMap(structures.map((s) => s.categoryId)),
      nameMap("academic-session"),
    ]);

    return structures.map((s) => ({
      id: s.id,
      sessionId: s.sessionId,
      sessionName: sessionNames[s.sessionId] ?? "—",
      classId: s.classId,
      className: classNames[s.classId] ?? "—",
      batchId: s.batchId ?? null,
      batchName: s.batchId ? batchNames[s.batchId] ?? null : null,
      categoryId: s.categoryId,
      categoryName: categoryNames[s.categoryId] ?? "—",
      amount: toNum(s.amount),
      dueDate: s.dueDate ? s.dueDate.toISOString().split("T")[0]! : null,
      lateFeeAmount: toNum(s.lateFeeAmount),
      lateFeeAfterDays: s.lateFeeAfterDays,
      status: s.status,
    }));
  },

  async createFeeStructure(values: FeeStructureValues): Promise<string> {
    const created = await prisma.feeStructure.create({
      data: {
        sessionId: values.sessionId,
        classId: values.classId,
        batchId: values.batchId || null,
        categoryId: values.categoryId,
        amount: dec(values.amount),
        dueDate: values.dueDate ? new Date(values.dueDate) : null,
        lateFeeAmount: dec(values.lateFeeAmount),
        lateFeeAfterDays: Math.round(values.lateFeeAfterDays),
        status: "ACTIVE",
      },
    });
    return created.id;
  },

  async updateFeeStructure(id: string, values: FeeStructureValues): Promise<void> {
    await prisma.feeStructure.update({
      where: { id },
      data: {
        sessionId: values.sessionId,
        classId: values.classId,
        batchId: values.batchId || null,
        categoryId: values.categoryId,
        amount: dec(values.amount),
        dueDate: values.dueDate ? new Date(values.dueDate) : null,
        lateFeeAmount: dec(values.lateFeeAmount),
        lateFeeAfterDays: Math.round(values.lateFeeAfterDays),
        status: "ACTIVE",
      },
    });
  },

  async deleteFeeStructure(id: string): Promise<void> {
    await prisma.feeStructure.update({ where: { id }, data: { deletedAt: new Date() } });
  },

  // ---- Student Fee Assignment ----
  async assignStudentFees(values: StudentFeeAssignValues): Promise<number> {
    const structure = await prisma.feeStructure.findUnique({
      where: { id: values.structureId },
    });
    if (!structure) return 0;

    let targetStudentIds: string[] = [];
    if (values.assignmentType === "SINGLE") {
      targetStudentIds = values.studentId ? [values.studentId] : [];
    } else if (values.assignmentType === "BATCH") {
      const students = await prisma.student.findMany({
        where: { batchId: values.batchId, deletedAt: null },
        select: { id: true },
      });
      targetStudentIds = students.map((s) => s.id);
    } else if (values.assignmentType === "CLASS") {
      const students = await prisma.student.findMany({
        where: { classId: values.classId, deletedAt: null },
        select: { id: true },
      });
      targetStudentIds = students.map((s) => s.id);
    } else {
      const students = await prisma.student.findMany({
        where: { sessionId: values.sessionId, deletedAt: null },
        select: { id: true },
      });
      targetStudentIds = students.map((s) => s.id);
    }

    const dueDate = structure.dueDate ?? null;
    const count = Math.max(1, Math.round(values.installmentCount));
    const perInstallment = toNum(structure.amount) / count;

    let created = 0;
    for (const studentId of targetStudentIds) {
      const existing = await prisma.studentFee.findFirst({
        where: { studentId, structureId: structure.id, deletedAt: null },
      });
      if (existing) continue;

      const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: { classId: true, batchId: true },
      });
      if (!student) continue;

      const fee = await prisma.studentFee.create({
        data: {
          studentId,
          structureId: structure.id,
          sessionId: structure.sessionId,
          classId: student.classId,
          categoryId: structure.categoryId,
          batchId: student.batchId,
          assignmentType: values.assignmentType,
          totalAmount: structure.amount,
          discountAmount: dec(0),
          paidAmount: dec(0),
          dueAmount: structure.amount,
          status: "PENDING",
          dueDate,
        },
      });

      if (count > 1) {
        const base = dueDate ? new Date(dueDate) : new Date();
        const installments: { dueDate: Date; amount: Prisma.Decimal; status: string; studentFeeId: string }[] = [];
        for (let i = 0; i < count; i++) {
          const d = new Date(base);
          d.setUTCMonth(d.getUTCMonth() + i);
          installments.push({
            dueDate: d,
            amount: dec(Number(perInstallment.toFixed(2))),
            status: "PENDING",
            studentFeeId: fee.id,
          });
        }
        await prisma.studentFeeInstallment.createMany({ data: installments });
      }

      await prisma.feeLedger.create({
        data: {
          studentFeeId: fee.id,
          studentId,
          type: "CHARGE",
          amount: structure.amount,
          balanceAfter: structure.amount,
          description: "Fee assigned",
        },
      });
      created++;
    }
    return created;
  },

  // ---- Student Fees listing ----
  async getStudentFees(filters: FeeFilters): Promise<StudentFeeRow[]> {
    const where: Prisma.StudentFeeWhereInput = { deletedAt: null };
    if (filters.sessionId) where.sessionId = filters.sessionId;
    if (filters.classId) where.classId = filters.classId;
    if (filters.batchId) where.batchId = filters.batchId;
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.status) where.status = filters.status;

    if (filters.search) {
      const matched = await prisma.student.findMany({
        where: {
          deletedAt: null,
          OR: [
            { firstName: { contains: filters.search, mode: "insensitive" } },
            { lastName: { contains: filters.search, mode: "insensitive" } },
            { admissionNumber: { contains: filters.search, mode: "insensitive" } },
          ],
        },
        select: { id: true },
      });
      where.studentId = { in: matched.map((m) => m.id) };
    }

    const fees = await prisma.studentFee.findMany({
      where,
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
      take: 300,
    });

    const [studentMap, classNames, batchNames, categoryNames] = await Promise.all([
      studentBasicMap(fees.map((f) => f.studentId)),
      nameMap("class"),
      batchNameMap(fees.map((f) => f.batchId ?? "").filter(Boolean)),
      categoryNameMap(fees.map((f) => f.categoryId)),
    ]);

    return fees.map((f) => {
      const student = studentMap[f.studentId];
      return {
        id: f.id,
        studentId: f.studentId,
        studentName: student?.name ?? "—",
        admissionNumber: student?.admissionNumber ?? "—",
        classId: f.classId,
        className: classNames[f.classId] ?? "—",
        batchId: f.batchId,
        batchName: f.batchId ? batchNames[f.batchId] ?? null : null,
        categoryId: f.categoryId,
        categoryName: categoryNames[f.categoryId] ?? "—",
        sessionId: f.sessionId,
        assignmentType: f.assignmentType,
        totalAmount: toNum(f.totalAmount),
        discountAmount: toNum(f.discountAmount),
        paidAmount: toNum(f.paidAmount),
        dueAmount: toNum(f.dueAmount),
        status: f.status,
        dueDate: f.dueDate ? f.dueDate.toISOString().split("T")[0]! : null,
      } satisfies StudentFeeRow;
    });
  },

  async getStudentFeeDetail(id: string): Promise<StudentFeeDetail | null> {
    const fee = await prisma.studentFee.findUnique({ where: { id, deletedAt: null } });
    if (!fee) return null;

    const [installments, discounts, payments, ledger, studentMap, classNames, batchNames, categoryNames] =
      await Promise.all([
        prisma.studentFeeInstallment.findMany({
          where: { studentFeeId: id, deletedAt: null },
          orderBy: { dueDate: "asc" },
        }),
        prisma.feeDiscount.findMany({ where: { studentFeeId: id, deletedAt: null }, orderBy: { createdAt: "desc" } }),
        prisma.feePayment.findMany({ where: { studentFeeId: id, deletedAt: null }, orderBy: { paymentDate: "desc" } }),
        prisma.feeLedger.findMany({ where: { studentFeeId: id }, orderBy: { createdAt: "asc" } }),
        studentBasicMap([fee.studentId]),
        nameMap("class"),
        batchNameMap(fee.batchId ? [fee.batchId] : []),
        categoryNameMap([fee.categoryId]),
      ]);
    const userNames = await userNameMap(payments.map((p) => p.collectedById));

    const student = studentMap[fee.studentId];
    const installs: InstallmentRow[] = installments.map((i) => ({
      id: i.id,
      studentFeeId: i.studentFeeId,
      dueDate: i.dueDate ? i.dueDate.toISOString().split("T")[0]! : null,
      amount: toNum(i.amount),
      status: i.status,
      paidDate: i.paidDate ? i.paidDate.toISOString().split("T")[0]! : null,
    }));
    const discRows: DiscountRow[] = discounts.map((d) => ({
      id: d.id,
      studentFeeId: d.studentFeeId,
      studentName: student?.name ?? "—",
      type: d.type,
      mode: d.mode,
      value: toNum(d.value),
      amount: toNum(d.amount),
      reason: d.reason,
      approvalRequired: d.approvalRequired,
      status: d.status,
      approvedBy: d.approvedBy,
    }));
    const payRows: PaymentRow[] = payments.map((p) => ({
      id: p.id,
      studentFeeId: p.studentFeeId,
      studentName: student?.name ?? "—",
      amount: toNum(p.amount),
      mode: p.mode,
      transactionRef: p.transactionRef,
      collectedByName: userNames[p.collectedById] ?? "—",
      paymentDate: p.paymentDate.toISOString().split("T")[0]!,
      remarks: p.remarks,
    }));
    const ledRows: LedgerRow[] = ledger.map((l) => ({
      id: l.id,
      type: l.type,
      amount: toNum(l.amount),
      balanceAfter: toNum(l.balanceAfter),
      description: l.description,
      createdAt: l.createdAt.toISOString().split("T")[0]!,
    }));

    return {
      id: fee.id,
      studentId: fee.studentId,
      studentName: student?.name ?? "—",
      admissionNumber: student?.admissionNumber ?? "—",
      classId: fee.classId,
      className: classNames[fee.classId] ?? "—",
      batchId: fee.batchId,
      batchName: fee.batchId ? batchNames[fee.batchId] ?? null : null,
      categoryId: fee.categoryId,
      categoryName: categoryNames[fee.categoryId] ?? "—",
      sessionId: fee.sessionId,
      assignmentType: fee.assignmentType,
      totalAmount: toNum(fee.totalAmount),
      discountAmount: toNum(fee.discountAmount),
      paidAmount: toNum(fee.paidAmount),
      dueAmount: toNum(fee.dueAmount),
      status: fee.status,
      dueDate: fee.dueDate ? fee.dueDate.toISOString().split("T")[0]! : null,
      installments: installs,
      discounts: discRows,
      payments: payRows,
      ledger: ledRows,
    };
  },

  async searchStudents(query: string): Promise<{ id: string; name: string; admissionNumber: string }[]> {
    if (!query) return [];
    const students = await prisma.student.findMany({
      where: {
        deletedAt: null,
        OR: [
          { firstName: { contains: query, mode: "insensitive" } },
          { lastName: { contains: query, mode: "insensitive" } },
          { admissionNumber: { contains: query, mode: "insensitive" } },
        ],
      },
      select: { id: true, firstName: true, lastName: true, admissionNumber: true },
      take: 10,
    });
    return students.map((s) => ({
      id: s.id,
      name: fullName(s.firstName, s.lastName) || s.admissionNumber,
      admissionNumber: s.admissionNumber,
    }));
  },

  // ---- Discounts ----
  async createDiscount(values: DiscountValues): Promise<string> {
    const fee = await prisma.studentFee.findUnique({ where: { id: values.studentFeeId, deletedAt: null } });
    if (!fee) throw new Error("Student fee not found");

    const amount =
      values.mode === "PERCENTAGE"
        ? Math.min(toNum(fee.totalAmount), (toNum(fee.totalAmount) * values.value) / 100)
        : values.value;

    const status = values.approvalRequired ? "PENDING" : "APPROVED";

    const discount = await prisma.feeDiscount.create({
      data: {
        studentFeeId: values.studentFeeId,
        studentId: fee.studentId,
        type: values.type,
        mode: values.mode,
        value: dec(values.value),
        amount: dec(amount),
        reason: values.reason || null,
        approvalRequired: values.approvalRequired,
        status,
      },
    });

    if (status === "APPROVED") {
      await this.applyDiscount(fee.id, amount);
    }
    return discount.id;
  },

  async approveDiscount(id: string, actorId: string): Promise<void> {
    const discount = await prisma.feeDiscount.findUnique({ where: { id } });
    if (!discount || discount.status !== "PENDING") return;
    await prisma.feeDiscount.update({
      where: { id },
      data: { status: "APPROVED", approvedBy: actorId },
    });
    await this.applyDiscount(discount.studentFeeId, toNum(discount.amount));
  },

  async applyDiscount(studentFeeId: string, amount: number): Promise<void> {
    const fee = await prisma.studentFee.findUnique({ where: { id: studentFeeId, deletedAt: null } });
    if (!fee) return;
    const newDiscount = toNum(fee.discountAmount) + amount;
    const { dueAmount, status } = applyBalance({
      totalAmount: fee.totalAmount,
      discountAmount: dec(newDiscount),
      paidAmount: fee.paidAmount,
      status: fee.status,
    });
    await prisma.studentFee.update({
      where: { id: studentFeeId },
      data: { discountAmount: dec(newDiscount), dueAmount: dec(dueAmount), status },
    });
    await prisma.feeLedger.create({
      data: {
        studentFeeId,
        studentId: fee.studentId,
        type: "DISCOUNT",
        amount: dec(amount),
        balanceAfter: dec(dueAmount),
        description: "Discount applied",
      },
    });
  },

  // ---- Payments & Receipts ----
  async collectPayment(values: PaymentValues, actorId: string): Promise<string> {
    const fee = await prisma.studentFee.findUnique({ where: { id: values.studentFeeId, deletedAt: null } });
    if (!fee) throw new Error("Student fee not found");

    const amount = Number(values.amount);
    const payment = await prisma.feePayment.create({
      data: {
        studentFeeId: fee.id,
        studentId: fee.studentId,
        amount: dec(amount),
        mode: values.mode,
        transactionRef: values.transactionRef || null,
        collectedById: actorId,
        paymentDate: new Date(values.paymentDate),
        remarks: values.remarks || null,
      },
    });

    const newPaid = toNum(fee.paidAmount) + amount;
    const { dueAmount, status } = applyBalance({
      totalAmount: fee.totalAmount,
      discountAmount: fee.discountAmount,
      paidAmount: dec(newPaid),
      status: fee.status,
    });
    await prisma.studentFee.update({
      where: { id: fee.id },
      data: { paidAmount: dec(newPaid), dueAmount: dec(dueAmount), status },
    });

    const receiptNumber = await this.nextReceiptNumber();
    const primaryParent = await prisma.studentParent.findFirst({
      where: { studentId: fee.studentId, isPrimary: true },
      select: { parentId: true },
    });

    const receipt = await prisma.feeReceipt.create({
      data: {
        receiptNumber,
        studentFeeId: fee.id,
        studentId: fee.studentId,
        parentId: primaryParent?.parentId ?? null,
        totalAmount: fee.totalAmount,
        discountAmount: fee.discountAmount,
        paidAmount: dec(newPaid),
        balance: dec(dueAmount),
        generatedById: actorId,
        meta: ACADEMY_INFO as unknown as Prisma.InputJsonValue,
        generatedAt: new Date(),
      },
    });

    await prisma.feePayment.update({ where: { id: payment.id }, data: { receiptId: receipt.id } });

    await prisma.feeLedger.create({
      data: {
        studentFeeId: fee.id,
        studentId: fee.studentId,
        type: "PAYMENT",
        amount: dec(amount),
        balanceAfter: dec(dueAmount),
        referenceId: payment.id,
        description: `Payment received (${receiptNumber})`,
      },
    });

    return receipt.id;
  },

  async nextReceiptNumber(): Promise<string> {
    const now = new Date();
    const prefix = `BKH${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
    const count = await prisma.feeReceipt.count({ where: { receiptNumber: { startsWith: prefix } } });
    return `${prefix}-${String(count + 1).padStart(4, "0")}`;
  },

  async getReceipt(id: string): Promise<ReceiptData | null> {
    const receipt = await prisma.feeReceipt.findUnique({ where: { id, deletedAt: null } });
    if (!receipt) return null;
    const fee = await prisma.studentFee.findUnique({ where: { id: receipt.studentFeeId } });
    const studentMap = await studentBasicMap([receipt.studentId]);
    const student = studentMap[receipt.studentId];
    const categoryNames = await categoryNameMap(fee ? [fee.categoryId] : []);
    const classNames = await nameMap("class");
    const parentName = receipt.parentId
      ? (await userNameMap([receipt.parentId]))[receipt.parentId] ?? null
      : null;

    return {
      id: receipt.id,
      receiptNumber: receipt.receiptNumber,
      studentName: student?.name ?? "—",
      admissionNumber: student?.admissionNumber ?? "—",
      parentName,
      categoryName: fee ? categoryNames[fee.categoryId] ?? "—" : "—",
      className: fee && student ? classNames[student.classId] ?? "—" : "—",
      totalAmount: toNum(receipt.totalAmount),
      discountAmount: toNum(receipt.discountAmount),
      paidAmount: toNum(receipt.paidAmount),
      balance: toNum(receipt.balance),
      generatedAt: receipt.generatedAt.toISOString().split("T")[0]!,
      lines: [
        { label: "Total Fee", amount: toNum(receipt.totalAmount) },
        { label: "Discount", amount: -toNum(receipt.discountAmount) },
        { label: "Amount Paid", amount: toNum(receipt.paidAmount) },
        { label: "Balance", amount: toNum(receipt.balance) },
      ],
    };
  },

  async getReceiptsByStudent(studentIds: string[]): Promise<ReceiptData[]> {
    if (!studentIds.length) return [];
    const receipts = await prisma.feeReceipt.findMany({
      where: { studentId: { in: studentIds }, deletedAt: null },
      orderBy: { generatedAt: "desc" },
    });
    const studentMap = await studentBasicMap(receipts.map((r) => r.studentId));
    const feeIds = receipts.map((r) => r.studentFeeId);
    const fees = await prisma.studentFee.findMany({
      where: { id: { in: feeIds } },
      select: { id: true, categoryId: true },
    });
    const categoryNames = await categoryNameMap(fees.map((f) => f.categoryId));
    const classNames = await nameMap("class");

    return receipts.map((r) => {
      const student = studentMap[r.studentId];
      const fee = fees.find((f) => f.id === r.studentFeeId);
      return {
        id: r.id,
        receiptNumber: r.receiptNumber,
        studentName: student?.name ?? "—",
        admissionNumber: student?.admissionNumber ?? "—",
        parentName: null,
        categoryName: fee ? categoryNames[fee.categoryId] ?? "—" : "—",
        className: student ? classNames[student.classId] ?? "—" : "—",
        totalAmount: toNum(r.totalAmount),
        discountAmount: toNum(r.discountAmount),
        paidAmount: toNum(r.paidAmount),
        balance: toNum(r.balance),
        generatedAt: r.generatedAt.toISOString().split("T")[0]!,
        lines: [],
      };
    });
  },

  async listReceipts(): Promise<ReceiptData[]> {
    const receipts = await prisma.feeReceipt.findMany({
      where: { deletedAt: null },
      orderBy: { generatedAt: "desc" },
      take: 200,
    });
    const studentMap = await studentBasicMap(receipts.map((r) => r.studentId));
    const feeIds = receipts.map((r) => r.studentFeeId);
    const fees = await prisma.studentFee.findMany({
      where: { id: { in: feeIds } },
      select: { id: true, categoryId: true },
    });
    const categoryNames = await categoryNameMap(fees.map((f) => f.categoryId));
    const classNames = await nameMap("class");

    return receipts.map((r) => {
      const student = studentMap[r.studentId];
      const fee = fees.find((f) => f.id === r.studentFeeId);
      return {
        id: r.id,
        receiptNumber: r.receiptNumber,
        studentName: student?.name ?? "—",
        admissionNumber: student?.admissionNumber ?? "—",
        parentName: null,
        categoryName: fee ? categoryNames[fee.categoryId] ?? "—" : "—",
        className: student ? classNames[student.classId] ?? "—" : "—",
        totalAmount: toNum(r.totalAmount),
        discountAmount: toNum(r.discountAmount),
        paidAmount: toNum(r.paidAmount),
        balance: toNum(r.balance),
        generatedAt: r.generatedAt.toISOString().split("T")[0]!,
        lines: [],
      };
    });
  },

  // ---- Dashboard & Reports ----
  async getOutstandingDashboard(): Promise<OutstandingDashboard> {
    const agg = await prisma.studentFee.aggregate({
      where: { deletedAt: null, status: { in: ["PENDING", "PARTIAL", "OVERDUE"] } },
      _sum: { dueAmount: true },
    });
    const totalOutstanding = toNum(agg._sum.dueAmount);

    const now = new Date();
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const paymentAgg = await prisma.feePayment.aggregate({
      where: { deletedAt: null, paymentDate: { gte: monthStart } },
      _sum: { amount: true },
    });
    const collectedThisMonth = toNum(paymentAgg._sum.amount);

    const overdueStudents = await prisma.studentFee.count({
      where: { deletedAt: null, dueAmount: { gt: 0 }, dueDate: { lt: now }, status: { not: "PAID" } },
    });

    const in30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const upcomingAgg = await prisma.studentFee.aggregate({
      where: { deletedAt: null, dueDate: { gte: now, lte: in30 }, status: { not: "PAID" } },
      _sum: { dueAmount: true },
    });
    const upcomingDue = toNum(upcomingAgg._sum.dueAmount);

    return { totalOutstanding, collectedThisMonth, overdueStudents, upcomingDue };
  },

  async getFinanceReports(filters: FeeFilters): Promise<FinanceReports> {
    const where: Prisma.StudentFeeWhereInput = { deletedAt: null };
    if (filters.sessionId) where.sessionId = filters.sessionId;
    if (filters.classId) where.classId = filters.classId;
    if (filters.batchId) where.batchId = filters.batchId;
    if (filters.categoryId) where.categoryId = filters.categoryId;

    const outstanding = await this.getStudentFees(filters);

    const payments = await prisma.feePayment.findMany({
      where: {
        deletedAt: null,
        ...(filters.sessionId ? { studentFee: { sessionId: filters.sessionId } } : {}),
      },
      orderBy: { paymentDate: "desc" },
      take: 100,
    });
    const studentIds = Array.from(new Set(payments.map((p) => p.studentId)));
    const studentMap = await studentBasicMap(studentIds);
    const userNames = await userNameMap(payments.map((p) => p.collectedById));
    const paymentHistory: PaymentRow[] = payments.map((p) => ({
      id: p.id,
      studentFeeId: p.studentFeeId,
      studentName: studentMap[p.studentId]?.name ?? "—",
      amount: toNum(p.amount),
      mode: p.mode,
      transactionRef: p.transactionRef,
      collectedByName: userNames[p.collectedById] ?? "—",
      paymentDate: p.paymentDate.toISOString().split("T")[0]!,
      remarks: p.remarks,
    }));

    const discounts = await prisma.feeDiscount.findMany({
      where: { deletedAt: null, status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    const discStudentMap = await studentBasicMap(discounts.map((d) => d.studentId));
    const discountList: DiscountRow[] = discounts.map((d) => ({
      id: d.id,
      studentFeeId: d.studentFeeId,
      studentName: discStudentMap[d.studentId]?.name ?? "—",
      type: d.type,
      mode: d.mode,
      value: toNum(d.value),
      amount: toNum(d.amount),
      reason: d.reason,
      approvalRequired: d.approvalRequired,
      status: d.status,
      approvedBy: d.approvedBy,
    }));

    const collectionAgg = await prisma.feePayment.aggregate({
      where: { deletedAt: null },
      _sum: { amount: true },
    });
    const byMode = await prisma.feePayment.groupBy({
      by: ["mode"],
      where: { deletedAt: null },
      _sum: { amount: true },
    });

    return {
      collectionTotal: toNum(collectionAgg._sum.amount),
      collectionByMode: byMode.map((b) => ({ mode: b.mode, amount: toNum(b._sum.amount) })),
      outstanding,
      discounts: discountList,
      paymentHistory,
    };
  },

  // ---- Parent view ----
  async getParentFeeSummary(studentIds: string[]): Promise<{
    total: number;
    paid: number;
    pending: number;
    dueDate: string | null;
    history: { id: string; studentName: string; amount: number; date: string; receiptNumber: string }[];
  }> {
    if (!studentIds.length) {
      return { total: 0, paid: 0, pending: 0, dueDate: null, history: [] };
    }
    const fees = await prisma.studentFee.findMany({
      where: { studentId: { in: studentIds }, deletedAt: null },
      select: { totalAmount: true, paidAmount: true, dueAmount: true, dueDate: true },
    });
    const total = fees.reduce((s, f) => s + toNum(f.totalAmount), 0);
    const paid = fees.reduce((s, f) => s + toNum(f.paidAmount), 0);
    const pending = fees.reduce((s, f) => s + toNum(f.dueAmount), 0);
    const dueDates = fees.map((f) => f.dueDate).filter(Boolean) as Date[];
    const dueDate = dueDates.length
      ? dueDates.sort((a, b) => a.getTime() - b.getTime())[0]!.toISOString().split("T")[0]!
      : null;

    const receipts = await this.getReceiptsByStudent(studentIds);
    const history = receipts.map((r) => ({
      id: r.id,
      studentName: r.studentName,
      amount: r.paidAmount,
      date: r.generatedAt,
      receiptNumber: r.receiptNumber,
    }));

    return { total, paid, pending, dueDate, history };
  },
};
