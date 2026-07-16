import { prisma } from "@/database/prisma";

export type AuditAction =
  | "LOGIN"
  | "LOGOUT"
  | "USER_CREATED"
  | "USER_UPDATED"
  | "PASSWORD_RESET"
  | "STATUS_CHANGED"
  | "USER_DELETED";

export interface AuditEntry {
  action: AuditAction;
  actorId?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}

export const auditLogRepository = {
  async record(entry: AuditEntry): Promise<void> {
    await prisma.auditLog.create({
      data: {
        action: entry.action,
        actorId: entry.actorId ?? null,
        entityType: entry.entityType ?? null,
        entityId: entry.entityId ?? null,
        metadata: (entry.metadata as object | undefined) ?? undefined,
      },
    });
  },

  async list(limit = 50) {
    return prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { actor: { include: { profile: true } } },
    });
  },
};
