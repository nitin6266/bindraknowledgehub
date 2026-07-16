import { prisma } from "@/database/prisma";
import type { MasterModuleKey } from "@/features/academic/master-data/constants";
import type { MasterRow } from "@/features/academic/master-data/types";

/**
 * Generic data layer for the 8 Academic Master Data entities.
 * Delegates are accessed through a minimal structural type so we can stay
 * type-safe without resorting to `any`. Row shapes are widened to `MasterRow`.
 */
interface GenericDelegate {
  findMany: (args: Record<string, unknown>) => Promise<unknown[]>;
  findUnique: (args: Record<string, unknown>) => Promise<unknown | null>;
  create: (args: Record<string, unknown>) => Promise<unknown>;
  update: (args: Record<string, unknown>) => Promise<unknown>;
  delete: (args: Record<string, unknown>) => Promise<unknown>;
}

const delegates: Record<MasterModuleKey, GenericDelegate> = {
  "academic-session": prisma.academicSession as unknown as GenericDelegate,
  class: prisma.class as unknown as GenericDelegate,
  section: prisma.section as unknown as GenericDelegate,
  subject: prisma.subject as unknown as GenericDelegate,
  "time-slot": prisma.timeSlot as unknown as GenericDelegate,
  "batch-timing": prisma.batchTiming as unknown as GenericDelegate,
  "batch-type": prisma.batchType as unknown as GenericDelegate,
  "academic-calendar": prisma.academicCalendar as unknown as GenericDelegate,
};

function includeFor(module: MasterModuleKey): Record<string, unknown> | undefined {
  switch (module) {
    case "section":
      return { class: { select: { id: true, name: true } } };
    case "subject":
      return { classes: { select: { id: true, name: true } } };
    case "class":
      return { session: { select: { id: true, name: true } } };
    case "academic-calendar":
      return { session: { select: { id: true, name: true } } };
    default:
      return undefined;
  }
}

function orderByFor(module: MasterModuleKey): Record<string, unknown> {
  switch (module) {
    case "class":
    case "time-slot":
      return { displayOrder: "asc" };
    case "academic-session":
      return { startDate: "desc" };
    case "academic-calendar":
      return { date: "asc" };
    case "subject":
      return { name: "asc" };
    default:
      return { name: "asc" };
  }
}

export const masterDataRepository = {
  /** Lists non-deleted rows for a module, with relation includes where applicable. */
  async list(module: MasterModuleKey): Promise<MasterRow[]> {
    const delegate = delegates[module];
    const rows = await delegate.findMany({
      where: { deletedAt: null },
      include: includeFor(module),
      orderBy: orderByFor(module),
    });
    return rows as unknown as MasterRow[];
  },

  async getById(module: MasterModuleKey, id: string): Promise<MasterRow | null> {
    const delegate = delegates[module];
    const row = await delegate.findUnique({
      where: { id },
      include: includeFor(module),
    });
    return (row as MasterRow) ?? null;
  },

  async create(module: MasterModuleKey, data: Record<string, unknown>): Promise<MasterRow> {
    const delegate = delegates[module];
    const row = await delegate.create({ data });
    return row as unknown as MasterRow;
  },

  async update(module: MasterModuleKey, id: string, data: Record<string, unknown>): Promise<MasterRow> {
    const delegate = delegates[module];
    const row = await delegate.update({ where: { id }, data });
    return row as unknown as MasterRow;
  },

  /** Soft delete via `deletedAt`. */
  async softDelete(module: MasterModuleKey, id: string): Promise<void> {
    const delegate = delegates[module];
    await delegate.update({ where: { id }, data: { deletedAt: new Date() } });
  },

  /**
   * Enforces the "only one ACTIVE session" rule. Other ACTIVE sessions are
   * moved to ARCHIVED. `exceptId` is the session currently being edited.
   */
  async archiveOtherActiveSessions(exceptId: string): Promise<void> {
    await prisma.academicSession.updateMany({
      where: { status: "ACTIVE", id: { not: exceptId } },
      data: { status: "ARCHIVED" },
    });
  },
};
