import { PrismaClient } from "@prisma/client";

import { ROLES } from "../src/constants/roles";
import { createAdminClient } from "../src/lib/supabase/admin";

const prisma = new PrismaClient();

function labelFor(name: string): string {
  return name
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

async function getRoleId(name: string): Promise<string> {
  const role = await prisma.role.findUnique({ where: { name } });
  if (!role) {
    throw new Error(`Role "${name}" is missing. Run the seed script first.`);
  }
  return role.id;
}

/** Looks up an existing Supabase Auth user by email (service-role only). */
async function getAuthUserByEmail(email: string): Promise<{ id: string; email: string } | null> {
  const supabase = createAdminClient();
  const { data } = await supabase.auth.admin.listUsers();
  const users = ((data as { users?: Array<{ id: string; email?: string }> }).users ?? []) as Array<{
    id: string;
    email?: string;
  }>;
  const found = users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  return found ? { id: found.id, email: found.email ?? email } : null;
}

/**
 * Returns a Supabase Auth user for the given email, creating or updating it as
 * needed. The ERP role is stored in app_metadata. Falls back to a stronger
 * password when the project's password policy rejects the requested one.
 * Idempotent: reuses an existing auth user instead of failing on a duplicate.
 */
async function ensureAuthUser(opts: {
  email: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  phone: string;
}): Promise<{ id: string; email: string }> {
  const supabase = createAdminClient();

  const existing = await getAuthUserByEmail(opts.email);
  if (existing) {
    const { error } = await supabase.auth.admin.updateUserById(existing.id, {
      password: opts.password,
      app_metadata: { role: opts.role },
      user_metadata: {
        first_name: opts.firstName,
        last_name: opts.lastName,
        phone: opts.phone,
      },
    });
    if (error) {
      throw new Error(`Failed to update auth user ${opts.email}: ${error.message}`);
    }
    return { id: existing.id, email: opts.email };
  }

  const attempt = (password: string) =>
    supabase.auth.admin.createUser({
      email: opts.email,
      password,
      email_confirm: true,
      app_metadata: { role: opts.role },
      user_metadata: {
        first_name: opts.firstName,
        last_name: opts.lastName,
        phone: opts.phone,
      },
    });

  let res = await attempt(opts.password);
  if (res.error && /password/i.test(res.error.message)) {
    const fallback = "Admin@123";
    console.warn(`  Password policy rejected "${opts.password}". Using fallback "${fallback}".`);
    res = await attempt(fallback);
  }

  if (res.error || !res.data.user) {
    throw new Error(
      `Failed to create auth user ${opts.email}: ${res.error?.message ?? "unknown error"}`,
    );
  }

  return { id: res.data.user.id, email: opts.email };
}

/**
 * Ensures a SUPER_ADMIN and a PARENT account exist (loginable). Returns the ERP
 * (DB) user ids so demo data can reference them. Idempotent by email.
 */
async function ensureAccounts(): Promise<{ superAdminId: string; parentId: string }> {
  const superRoleId = await getRoleId(ROLES.SUPER_ADMIN);
  const parentRoleId = await getRoleId(ROLES.PARENT);

  const superAuth = await ensureAuthUser({
    email: "admin@bindra.com",
    password: "Admin@123",
    role: ROLES.SUPER_ADMIN,
    firstName: "Site",
    lastName: "Administrator",
    phone: "+919999999999",
  });
  let superUser = await prisma.user.findUnique({ where: { email: superAuth.email } });
  if (!superUser) {
    superUser = await prisma.user.create({
      data: {
        authId: superAuth.id,
        email: superAuth.email,
        roleId: superRoleId,
        status: "ACTIVE",
        profile: {
          create: { firstName: "Site", lastName: "Administrator", phone: "+919999999999", gender: null },
        },
      },
    });
    console.log("Created SUPER_ADMIN: admin@bindra.com");
  } else {
    console.log("SUPER_ADMIN already exists.");
  }

  const parentAuth = await ensureAuthUser({
    email: "parent@bindra.com",
    password: "Parent@123",
    role: ROLES.PARENT,
    firstName: "Rajesh",
    lastName: "Sharma",
    phone: "+918888888888",
  });
  let parentUser = await prisma.user.findUnique({ where: { email: parentAuth.email } });
  if (!parentUser) {
    parentUser = await prisma.user.create({
      data: {
        authId: parentAuth.id,
        email: parentAuth.email,
        roleId: parentRoleId,
        status: "ACTIVE",
        profile: {
          create: { firstName: "Rajesh", lastName: "Sharma", phone: "+918888888888", gender: null },
        },
      },
    });
    console.log("Created PARENT: parent@bindra.com");
  } else {
    console.log("PARENT already exists.");
  }

  return { superAdminId: superUser.id, parentId: parentUser.id };
}

/**
 * Seeds one demo student, links them to the PARENT account, and creates a
 * realistic fee structure with installments, a payment, a receipt and ledger
 * entries so the Parent and Finance portals can be clicked through.
 * Idempotent by admission number.
 */
async function seedDemoStudentsAndFees(superAdminId: string, parentId: string): Promise<void> {
  const existing = await prisma.student.findUnique({ where: { admissionNumber: "BKH2025001" } });
  if (existing) {
    console.log("Demo student + fee data already present, skipping.");
    return;
  }

  const session = await prisma.academicSession.upsert({
    where: { name: "2025-26" },
    update: {},
    create: {
      name: "2025-26",
      startDate: new Date("2025-04-01"),
      endDate: new Date("2026-03-31"),
      status: "ACTIVE",
      description: "Academic year 2025-2026.",
    },
  });

  let class10 = await prisma.class.findFirst({ where: { name: "Class 10", sessionId: session.id } });
  if (!class10) {
    class10 = await prisma.class.create({
      data: { name: "Class 10", displayOrder: 10, status: "ACTIVE", sessionId: session.id },
    });
  }

  let sectionA = await prisma.section.findFirst({ where: { name: "A", classId: class10.id } });
  if (!sectionA) {
    sectionA = await prisma.section.create({
      data: { name: "A", status: "ACTIVE", classId: class10.id },
    });
  }

  const student = await prisma.student.create({
    data: {
      admissionNumber: "BKH2025001",
      rollNumber: "10",
      firstName: "Aarav",
      lastName: "Sharma",
      gender: "MALE",
      dateOfBirth: new Date("2012-06-15"),
      bloodGroup: "O+",
      address: "12 Green Avenue",
      city: "Delhi",
      state: "Delhi",
      country: "India",
      pincode: "110001",
      status: "ACTIVE",
      sessionId: session.id,
      classId: class10.id,
      sectionId: sectionA.id,
    },
  });

  await prisma.studentParent.create({
    data: {
      studentId: student.id,
      parentId,
      relationship: "FATHER",
      isPrimary: true,
      forcePasswordChange: true,
    },
  });

  const tuition = await prisma.feeCategory.upsert({
    where: { name: "Tuition Fee" },
    update: {},
    create: { name: "Tuition Fee", description: "Annual tuition fee.", status: "ACTIVE" },
  });
  const exam = await prisma.feeCategory.upsert({
    where: { name: "Exam Fee" },
    update: {},
    create: { name: "Exam Fee", description: "Term examination fee.", status: "ACTIVE" },
  });

  const dueDate = new Date("2026-04-30");

  const structure = await prisma.feeStructure.create({
    data: {
      sessionId: session.id,
      classId: class10.id,
      categoryId: tuition.id,
      amount: 50000,
      dueDate,
      lateFeeAmount: 500,
      lateFeeAfterDays: 15,
      status: "ACTIVE",
    },
  });

  const totalAmount = 50000;
  const discountAmount = 5000;
  const paidAmount = 20000;
  const dueAmount = totalAmount - discountAmount - paidAmount;

  const studentFee = await prisma.studentFee.create({
    data: {
      studentId: student.id,
      structureId: structure.id,
      sessionId: session.id,
      classId: class10.id,
      categoryId: tuition.id,
      assignmentType: "SINGLE",
      totalAmount,
      discountAmount,
      paidAmount,
      dueAmount,
      status: "PARTIAL",
      dueDate,
    },
  });

  await prisma.studentFeeInstallment.createMany({
    data: [
      {
        studentFeeId: studentFee.id,
        dueDate: new Date("2025-10-15"),
        amount: 25000,
        status: "PAID",
        paidDate: new Date("2025-10-10"),
      },
      { studentFeeId: studentFee.id, dueDate, amount: 25000, status: "PENDING" },
    ],
  });

  const discount = await prisma.feeDiscount.create({
    data: {
      studentFeeId: studentFee.id,
      studentId: student.id,
      type: "SCHOLARSHIP",
      mode: "FIXED",
      value: discountAmount,
      amount: discountAmount,
      reason: "Merit scholarship",
      approvedBy: superAdminId,
      approvalRequired: false,
      status: "APPROVED",
    },
  });

  const payment = await prisma.feePayment.create({
    data: {
      studentFeeId: studentFee.id,
      studentId: student.id,
      amount: paidAmount,
      mode: "CASH",
      collectedById: superAdminId,
      paymentDate: new Date("2025-10-10"),
      remarks: "First installment (Q1).",
    },
  });

  const receipt = await prisma.feeReceipt.create({
    data: {
      receiptNumber: "BKH-202510-0001",
      studentFeeId: studentFee.id,
      studentId: student.id,
      parentId,
      totalAmount,
      discountAmount,
      paidAmount,
      balance: dueAmount,
      generatedById: superAdminId,
    },
  });

  await prisma.feePayment.update({ where: { id: payment.id }, data: { receiptId: receipt.id } });

  await prisma.feeLedger.createMany({
    data: [
      {
        studentFeeId: studentFee.id,
        studentId: student.id,
        type: "CHARGE",
        amount: totalAmount,
        balanceAfter: totalAmount,
        description: "Tuition fee assigned",
      },
      {
        studentFeeId: studentFee.id,
        studentId: student.id,
        type: "DISCOUNT",
        amount: -discountAmount,
        balanceAfter: totalAmount - discountAmount,
        referenceId: discount.id,
        description: "Merit scholarship",
      },
      {
        studentFeeId: studentFee.id,
        studentId: student.id,
        type: "PAYMENT",
        amount: -paidAmount,
        balanceAfter: dueAmount,
        referenceId: payment.id,
        description: "Cash payment",
      },
    ],
  });

  // A small second fee (exam) so the portal shows multiple categories.
  await prisma.studentFee.create({
    data: {
      studentId: student.id,
      sessionId: session.id,
      classId: class10.id,
      categoryId: exam.id,
      assignmentType: "SINGLE",
      totalAmount: 2000,
      paidAmount: 0,
      dueAmount: 2000,
      status: "PENDING",
      dueDate,
    },
  });

  console.log("Seeded demo student Aarav Sharma (BKH2025001) + parent link + fee records.");
}

async function main() {
  for (const name of Object.values(ROLES)) {
    await prisma.role.upsert({
      where: { name },
      update: { label: labelFor(name) },
      create: { name, label: labelFor(name) },
    });
  }
  console.log("Seeded roles:", Object.values(ROLES).join(", "));

  await seedAcademicSample();

  const { superAdminId, parentId } = await ensureAccounts();
  await seedDemoStudentsAndFees(superAdminId, parentId);

  console.log("\n=== Demo login credentials ===");
  console.log("  SUPER_ADMIN : admin@bindra.com  / Admin@123");
  console.log("  PARENT      : parent@bindra.com / Parent@123");
  console.log("  Demo student: Aarav Sharma (BKH2025001), linked to the PARENT account.");
}

/**
 * Creates a small, realistic dataset so the Academic Master Data and Batch
 * Management modules can be clicked through. Idempotent: skips when the
 * sample session already exists.
 */
async function seedAcademicSample() {
  const existing = await prisma.academicSession.findUnique({ where: { name: "2025-26" } });
  if (existing) {
    console.log("Sample academic data already present, skipping.");
    return;
  }

  const session = await prisma.academicSession.create({
    data: {
      name: "2025-26",
      startDate: new Date("2025-04-01"),
      endDate: new Date("2026-03-31"),
      status: "ACTIVE",
      description: "Academic year 2025-2026.",
    },
  });

  const classes = await Promise.all(
    ["Class 3", "Class 4", "Class 10", "Class 11", "Class 12"].map((name, i) =>
      prisma.class.create({ data: { name, displayOrder: i + 3, status: "ACTIVE", sessionId: session.id } }),
    ),
  );
  const classById = Object.fromEntries(classes.map((c) => [c.name, c] as [string, (typeof classes)[number]])) as Record<string, { id: string }>;

  const sections = await Promise.all(
    [
      { name: "A", classId: classById["Class 10"]!.id },
      { name: "B", classId: classById["Class 10"]!.id },
      { name: "A", classId: classById["Class 11"]!.id },
      { name: "B", classId: classById["Class 11"]!.id },
    ].map((s) => prisma.section.create({ data: { ...s, status: "ACTIVE" } })),
  );
  const sectionA10 = sections[0]!;

  const subjectDefs: Array<{ name: string; code: string; classes: string[] }> = [
    { name: "Mathematics", code: "MATH", classes: ["Class 3", "Class 4", "Class 10", "Class 11", "Class 12"] },
    { name: "Science", code: "SCI", classes: ["Class 3", "Class 4", "Class 10", "Class 11", "Class 12"] },
    { name: "English", code: "ENG", classes: ["Class 3", "Class 4", "Class 10", "Class 11", "Class 12"] },
    { name: "Hindi", code: "HIN", classes: ["Class 3", "Class 4", "Class 10"] },
    { name: "Social Science", code: "SST", classes: ["Class 3", "Class 4", "Class 10"] },
    { name: "Physics", code: "PHY", classes: ["Class 11", "Class 12"] },
    { name: "Chemistry", code: "CHE", classes: ["Class 11", "Class 12"] },
    { name: "Computer Science", code: "CS", classes: ["Class 11", "Class 12"] },
  ];
  const subjects = await Promise.all(
    subjectDefs.map((s) => prisma.subject.create({ data: { name: s.name, code: s.code, status: "ACTIVE" } })),
  );
  const subjectById = Object.fromEntries(subjects.map((s) => [s.name, s] as [string, (typeof subjects)[number]])) as Record<string, { id: string }>;

  await prisma.subjectClass.createMany({
    data: subjectDefs.flatMap((s) =>
      s.classes.map((className) => ({
        subjectId: subjectById[s.name]!.id,
        classId: classById[className]!.id,
      })),
    ),
  });

  const batchTypes = await Promise.all(
    ["Offline", "Online", "Hybrid"].map((name) => prisma.batchType.create({ data: { name, status: "ACTIVE" } })),
  );
  const offlineType = batchTypes[0]!;

  await Promise.all(
    [
      { name: "08:00 – 09:00", startTime: "08:00", endTime: "09:00", displayOrder: 1 },
      { name: "09:00 – 10:00", startTime: "09:00", endTime: "10:00", displayOrder: 2 },
      { name: "10:00 – 11:00", startTime: "10:00", endTime: "11:00", displayOrder: 3 },
      { name: "11:00 – 12:00", startTime: "11:00", endTime: "12:00", displayOrder: 4 },
    ].map((t) => prisma.timeSlot.create({ data: { ...t, status: "ACTIVE" } })),
  );

  await prisma.academicCalendar.create({
    data: {
      title: "Summer Break",
      description: "School closed for summer vacation.",
      date: new Date("2026-05-15"),
      eventType: "HOLIDAY",
      status: "ACTIVE",
      sessionId: session.id,
    },
  });

  const batch = await prisma.batch.create({
    data: {
      name: "Class 10 A Morning",
      code: "C10A-MOR",
      sessionId: session.id,
      classId: classById["Class 10"]!.id,
      sectionId: sectionA10.id,
      batchTypeId: offlineType!.id,
      capacity: 40,
      currentStrength: 0,
      status: "ACTIVE",
      description: "Morning batch for Class 10 Section A.",
    },
  });

  await prisma.batchSchedule.createMany({
    data: [
      { batchId: batch.id, day: "MONDAY", startTime: "08:00", endTime: "09:00", room: "Room 101" },
      { batchId: batch.id, day: "WEDNESDAY", startTime: "08:00", endTime: "09:00", room: "Room 101" },
      { batchId: batch.id, day: "FRIDAY", startTime: "08:00", endTime: "09:00", room: "Room 101" },
    ],
  });

  await prisma.batchSubject.createMany({
    data: [
      { batchId: batch.id, subjectId: subjectById["Mathematics"]!.id, weeklyHours: 5, displayOrder: 1 },
      { batchId: batch.id, subjectId: subjectById["Science"]!.id, weeklyHours: 4, displayOrder: 2 },
    ],
  });

  console.log("Seeded sample academic data: 1 session, 5 classes, 4 sections, 8 subjects, 3 batch types, 4 time slots, 1 calendar event, 1 batch.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
