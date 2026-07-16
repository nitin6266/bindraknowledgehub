import { prisma } from "@/database/prisma";
import type { Prisma } from "@prisma/client";
import type { DocumentType } from "@prisma/client";

import { masterDataRepository } from "@/repositories/master-data.repository";
import { nameKeyFor } from "@/features/academic/master-data/config";
import type { MasterModuleKey } from "@/features/academic/master-data/constants";

import type {
  StudentDetail,
  StudentRow,
  StudentFilters,
  AdmissionValues,
  PromoteValues,
  UpdateStudentValues,
} from "@/features/student/student.types";
import type { StudentStatusValue } from "@/features/student/student.constants";

interface Scope {
  teacherScopeId?: string;
  parentScopeId?: string;
}

function fullName(first: string, last: string): string {
  return `${first} ${last}`.trim();
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

async function batchNameMap(ids: string[]): Promise<Record<string, string>> {
  const unique = Array.from(new Set(ids.filter(Boolean)));
  if (!unique.length) return {};
  const batches = await prisma.batch.findMany({ where: { id: { in: unique }, deletedAt: null } });
  const map: Record<string, string> = {};
  for (const b of batches) map[b.id] = b.name;
  return map;
}

async function userNameMap(ids: string[]): Promise<Record<string, string>> {
  const unique = Array.from(new Set(ids.filter(Boolean)));
  if (!unique.length) return {};
  const users = await prisma.user.findMany({ where: { id: { in: unique }, deletedAt: null }, include: { profile: true } });
  const map: Record<string, string> = {};
  for (const u of users) {
    map[u.id] = `${u.profile?.firstName ?? ""} ${u.profile?.lastName ?? ""}`.trim() || u.email;
  }
  return map;
}

async function userDetailMap(ids: string[]): Promise<Record<string, { name: string; email: string | null; phone: string | null }>> {
  const unique = Array.from(new Set(ids.filter(Boolean)));
  if (!unique.length) return {};
  const users = await prisma.user.findMany({ where: { id: { in: unique }, deletedAt: null }, include: { profile: true } });
  const map: Record<string, { name: string; email: string | null; phone: string | null }> = {};
  for (const u of users) {
    map[u.id] = {
      name: `${u.profile?.firstName ?? ""} ${u.profile?.lastName ?? ""}`.trim() || u.email,
      email: u.email,
      phone: u.profile?.phone ?? null,
    };
  }
  return map;
}

export const studentRepository = {
  async list(filters: StudentFilters = {}, scope: Scope = {}): Promise<StudentRow[]> {
    const where: Prisma.StudentWhereInput = { deletedAt: null };

    if (filters.sessionId) where.sessionId = filters.sessionId;
    if (filters.classId) where.classId = filters.classId;
    if (filters.status) where.status = filters.status as StudentStatusValue;
    if (filters.batchId) where.batchId = filters.batchId;

    if (scope.teacherScopeId) {
      const taught = await prisma.batchTeacher.findMany({
        where: { teacherId: scope.teacherScopeId, unassignedAt: null },
        select: { batchId: true },
      });
      const batchIds = taught.map((t) => t.batchId);
      where.batchId = batchIds.length ? { in: batchIds } : "___none___";
    }
    if (scope.parentScopeId) {
      where.parents = { some: { parentId: scope.parentScopeId } };
    }

    if (filters.search) {
      const term = filters.search.trim();
      if (term) {
        where.OR = [
          { admissionNumber: { contains: term, mode: "insensitive" } },
          { firstName: { contains: term, mode: "insensitive" } },
          { lastName: { contains: term, mode: "insensitive" } },
        ];
      }
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        parents: { where: { isPrimary: true }, select: { parentId: true }, take: 1 },
      },
      orderBy: [{ admissionNumber: "asc" }],
    });

    const [session, classMap, section, batchMap, parentMap] = await Promise.all([
      masterNameMap("academic-session"),
      masterNameMap("class"),
      masterNameMap("section"),
      batchNameMap(students.map((s) => s.batchId).filter((v): v is string => !!v)),
      userNameMap(students.flatMap((s) => s.parents.map((p) => p.parentId))),
    ]);

    return students.map((s) => {
      const primary = s.parents[0];
      return {
        id: s.id,
        admissionNumber: s.admissionNumber,
        firstName: s.firstName,
        lastName: s.lastName,
        fullName: fullName(s.firstName, s.lastName),
        gender: s.gender,
        status: s.status,
        sessionId: s.sessionId,
        classId: s.classId,
        sectionId: s.sectionId,
        batchId: s.batchId,
        sessionName: session[s.sessionId] ?? "—",
        className: classMap[s.classId] ?? "—",
        sectionName: s.sectionId ? (section[s.sectionId] ?? null) : null,
        batchName: s.batchId ? (batchMap[s.batchId] ?? null) : null,
        primaryParentName: primary ? (parentMap[primary.parentId] ?? null) : null,
        createdAt: s.createdAt.toISOString(),
        deletedAt: s.deletedAt ? s.deletedAt.toISOString() : null,
      };
    });
  },

  async getDetail(id: string): Promise<StudentDetail | null> {
    const student = await prisma.student.findUnique({
      where: { id, deletedAt: null },
      include: {
        parents: { orderBy: { isPrimary: "desc" } },
        documents: { orderBy: { uploadedAt: "desc" } },
        emergencyContact: true,
        medicalInformation: true,
        batchHistories: { orderBy: { fromDate: "desc" } },
        promotions: { orderBy: { promotedAt: "desc" } },
      },
    });
    if (!student) return null;

    const [session, classMap, section, batchMap, parentMap] = await Promise.all([
      masterNameMap("academic-session"),
      masterNameMap("class"),
      masterNameMap("section"),
      batchNameMap([student.batchId, ...student.batchHistories.map((h) => h.batchId)].filter((v): v is string => !!v)),
      userDetailMap(student.parents.map((p) => p.parentId)),
    ]);

    const sessionName = session[student.sessionId] ?? "—";
    const className = classMap[student.classId] ?? "—";
    const sectionName = student.sectionId ? (section[student.sectionId] ?? null) : null;
    const batchName = student.batchId ? (batchMap[student.batchId] ?? null) : null;
    const primaryParent = student.parents.find((p) => p.isPrimary);

    return {
      student: {
        id: student.id,
        admissionNumber: student.admissionNumber,
        rollNumber: student.rollNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        dateOfBirth: student.dateOfBirth.toISOString(),
        gender: student.gender,
        bloodGroup: student.bloodGroup,
        photoUrl: student.photoUrl,
        address: student.address,
        city: student.city,
        state: student.state,
        country: student.country,
        pincode: student.pincode,
        sessionId: student.sessionId,
        classId: student.classId,
        sectionId: student.sectionId,
        batchId: student.batchId,
        admissionDate: student.admissionDate.toISOString(),
        status: student.status,
        sessionName,
        className,
        sectionName,
        batchName,
        primaryParentName: primaryParent ? (parentMap[primaryParent.parentId]?.name ?? null) : null,
        createdAt: student.createdAt.toISOString(),
        deletedAt: student.deletedAt ? student.deletedAt.toISOString() : null,
      },
      parents: student.parents.map((p) => ({
        id: p.id,
        parentId: p.parentId,
        parentName: parentMap[p.parentId]?.name ?? "—",
        parentEmail: parentMap[p.parentId]?.email ?? null,
        parentPhone: parentMap[p.parentId]?.phone ?? null,
        relationship: p.relationship,
        isPrimary: p.isPrimary,
        forcePasswordChange: p.forcePasswordChange,
      })),
      emergencyContacts: student.emergencyContact
        ? [
            {
              id: student.emergencyContact.id,
              contactName: student.emergencyContact.name,
              relationship: student.emergencyContact.relationship,
              phoneNumber: student.emergencyContact.phone,
              alternatePhone: null,
              email: null,
            },
          ]
        : [],
      medicalInformation: student.medicalInformation
        ? {
            bloodGroup: student.bloodGroup,
            medicalConditions: student.medicalInformation.conditions,
            allergies: student.medicalInformation.allergies,
            medication: null,
            notes: student.medicalInformation.notes,
          }
        : null,
      documents: student.documents.map((d) => ({
        id: d.id,
        documentType: String(d.type),
        fileName: d.fileName,
        fileUrl: d.fileUrl,
        uploadedAt: d.uploadedAt.toISOString(),
        description: null,
      })),
      batchHistory: student.batchHistories.map((h) => ({
        id: h.id,
        batchId: h.batchId,
        batchName: batchMap[h.batchId] ?? "—",
        sessionName,
        changeType: h.type,
        startDate: h.fromDate.toISOString(),
        endDate: h.toDate ? h.toDate.toISOString() : null,
      })),
      promotionHistory: student.promotions.map((p) => ({
        id: p.id,
        fromClassName: classMap[p.fromClassId] ?? "—",
        toClassName: classMap[p.toClassId] ?? "—",
        promotionDate: p.promotedAt.toISOString(),
        note: p.note,
      })),
      currentBatch: student.batchId ? { id: student.batchId, name: batchName ?? "—" } : null,
    };
  },

  async createAdmission(
    values: AdmissionValues,
    parent: { parentId: string; relationship: AdmissionValues["relationship"]; isPrimary: boolean; forcePasswordChange: boolean },
  ): Promise<{ id: string }> {
    const admissionNumber = `ADM${Date.now().toString(36).toUpperCase()}`;
    return prisma.$transaction(async (tx) => {
      const student = await tx.student.create({
        data: {
          admissionNumber,
          firstName: values.firstName,
          lastName: values.lastName,
          gender: values.gender,
          dateOfBirth: new Date(values.dateOfBirth),
          bloodGroup: values.bloodGroup || null,
          rollNumber: values.rollNumber || null,
          address: values.address || null,
          city: values.city || null,
          state: values.state || null,
          country: values.country || null,
          pincode: values.pincode || null,
          sessionId: values.sessionId,
          classId: values.classId,
          sectionId: values.sectionId || null,
          batchId: values.batchId,
          emergencyContact: values.emergencyName
            ? {
                create: {
                  name: values.emergencyName,
                  relationship: values.emergencyRelationship,
                  phone: values.emergencyPhone,
                },
              }
            : undefined,
          medicalInformation: values.medicalConditions || values.medicalAllergies || values.medicalNotes
            ? {
                create: {
                  conditions: values.medicalConditions || null,
                  allergies: values.medicalAllergies || null,
                  notes: values.medicalNotes || null,
                },
              }
            : undefined,
        },
        select: { id: true },
      });

      await tx.studentParent.create({
        data: {
          studentId: student.id,
          parentId: parent.parentId,
          relationship: parent.relationship,
          isPrimary: parent.isPrimary,
          forcePasswordChange: parent.forcePasswordChange,
        },
      });

      if (values.batchId) {
        await tx.studentBatchHistory.create({
          data: { studentId: student.id, batchId: values.batchId, type: "ALLOCATION" },
        });
        await tx.batch.update({
          where: { id: values.batchId },
          data: { currentStrength: { increment: 1 } },
        });
      }

      return { id: student.id };
    });
  },

  async updateCore(id: string, values: UpdateStudentValues): Promise<void> {
    const data: Prisma.StudentUpdateInput = {};
    if (values.status !== undefined) data.status = values.status;
    if (values.address !== undefined) data.address = values.address;
    if (values.bloodGroup !== undefined) data.bloodGroup = values.bloodGroup;
    if (Object.keys(data).length > 0) {
      await prisma.student.update({ where: { id }, data });
    }

    if (values.emergencyContacts && values.emergencyContacts.length > 0) {
      const ec = values.emergencyContacts[0]!;
      await prisma.emergencyContact.upsert({
        where: { studentId: id },
        update: { name: ec.contactName, relationship: ec.relationship, phone: ec.phoneNumber },
        create: { studentId: id, name: ec.contactName, relationship: ec.relationship, phone: ec.phoneNumber },
      });
    }

    if (values.medical) {
      const m = values.medical;
      await prisma.medicalInformation.upsert({
        where: { studentId: id },
        update: { conditions: m.conditions ?? null, allergies: m.allergies ?? null, notes: m.notes ?? null },
        create: { studentId: id, conditions: m.conditions ?? null, allergies: m.allergies ?? null, notes: m.notes ?? null },
      });
    }
  },

  async setStatus(id: string, status: StudentStatusValue): Promise<void> {
    await prisma.student.update({ where: { id }, data: { status } });
  },

  async softDelete(id: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const current = await tx.student.findUnique({ where: { id }, select: { batchId: true } });
      if (current?.batchId) {
        await tx.batch.update({
          where: { id: current.batchId },
          data: { currentStrength: { decrement: 1 } },
        });
      }
      await tx.student.update({ where: { id }, data: { deletedAt: new Date(), status: "INACTIVE" } });
    });
  },

  async allocateBatch(id: string, toBatchId: string, reason: string | undefined, type: "ALLOCATION" | "TRANSFER"): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const current = await tx.student.findUnique({ where: { id }, select: { batchId: true } });
      if (current?.batchId && current.batchId !== toBatchId) {
        await tx.batch.update({
          where: { id: current.batchId },
          data: { currentStrength: { decrement: 1 } },
        });
        await tx.studentBatchHistory.updateMany({ where: { studentId: id, batchId: current.batchId, toDate: null }, data: { toDate: new Date() } });
      }
      await tx.student.update({ where: { id }, data: { batchId: toBatchId } });
      if (!current?.batchId || current.batchId !== toBatchId) {
        await tx.batch.update({
          where: { id: toBatchId },
          data: { currentStrength: { increment: 1 } },
        });
      }
      await tx.studentBatchHistory.create({ data: { studentId: id, batchId: toBatchId, type, reason: reason || null } });
    });
  },

  async promote(id: string, values: PromoteValues): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const current = await tx.student.findUnique({ where: { id }, select: { sessionId: true, classId: true } });
      if (!current) return;
      await tx.student.update({ where: { id }, data: { sessionId: values.toSessionId, classId: values.toClassId } });
      await tx.studentPromotionHistory.create({
        data: {
          studentId: id,
          fromSessionId: current.sessionId,
          toSessionId: values.toSessionId,
          fromClassId: current.classId,
          toClassId: values.toClassId,
          note: values.note || null,
        },
      });
    });
  },

  async promoteBulk(ids: string[], values: PromoteValues): Promise<number> {
    let count = 0;
    for (const id of ids) {
      await this.promote(id, values);
      count += 1;
    }
    return count;
  },

  async addDocument(input: {
    studentId: string;
    type: DocumentType;
    fileName: string;
    fileUrl: string;
    storagePath: string;
  }): Promise<void> {
    await prisma.studentDocument.create({ data: input });
  },

  async removeDocument(id: string): Promise<void> {
    await prisma.studentDocument.delete({ where: { id } });
  },
};
