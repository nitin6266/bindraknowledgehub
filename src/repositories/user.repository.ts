import { prisma } from "@/database/prisma";
import type { UserStatus } from "@prisma/client";

export const userWithRelations = {
  role: true,
  profile: true,
} as const;

export type UserRecord = {
  id: string;
  authId: string;
  email: string;
  roleId: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  role: { id: string; name: string; label: string };
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    gender: string | null;
    photoUrl: string | null;
  } | null;
};

export interface UserFilter {
  search?: string;
  roleId?: string;
  status?: UserStatus;
  includeDeleted?: boolean;
}

export const userRepository = {
  /** Lists active users with optional filtering. */
  async list(filter: UserFilter = {}): Promise<UserRecord[]> {
    const where: Record<string, unknown> = {};

    if (!filter.includeDeleted) {
      where.deletedAt = null;
    }
    if (filter.roleId) {
      where.roleId = filter.roleId;
    }
    if (filter.status) {
      where.status = filter.status;
    }
    if (filter.search) {
      const term = filter.search.trim();
      if (term) {
        where.OR = [
          { email: { contains: term, mode: "insensitive" } },
          { profile: { firstName: { contains: term, mode: "insensitive" } } },
          { profile: { lastName: { contains: term, mode: "insensitive" } } },
        ];
      }
    }

    const users = await prisma.user.findMany({
      where,
      include: userWithRelations,
      orderBy: [{ createdAt: "desc" }],
    });

    return users as unknown as UserRecord[];
  },

  async getById(id: string): Promise<UserRecord | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: userWithRelations,
    });
    return (user as unknown as UserRecord) ?? null;
  },

  async getByAuthId(authId: string): Promise<UserRecord | null> {
    const user = await prisma.user.findUnique({
      where: { authId },
      include: userWithRelations,
    });
    return (user as unknown as UserRecord) ?? null;
  },

  async getByEmail(email: string): Promise<UserRecord | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      include: userWithRelations,
    });
    return (user as unknown as UserRecord) ?? null;
  },

  async create(data: {
    authId: string;
    email: string;
    roleId: string;
    status?: UserStatus;
    profile: { firstName: string; lastName: string; phone?: string | null; gender?: string | null };
  }): Promise<UserRecord> {
    const user = await prisma.user.create({
      data: {
        authId: data.authId,
        email: data.email,
        roleId: data.roleId,
        status: data.status ?? "ACTIVE",
        profile: {
          create: {
            firstName: data.profile.firstName,
            lastName: data.profile.lastName,
            phone: data.profile.phone || null,
            gender: data.profile.gender || null,
          },
        },
      },
      include: userWithRelations,
    });
    return user as unknown as UserRecord;
  },

  async update(
    id: string,
    data: {
      roleId?: string;
      status?: UserStatus;
      profile?: { firstName?: string; lastName?: string; phone?: string | null; gender?: string | null };
    },
  ): Promise<UserRecord> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        roleId: data.roleId,
        status: data.status,
        profile: data.profile
          ? {
              upsert: {
                create: {
                  firstName: data.profile.firstName ?? "",
                  lastName: data.profile.lastName ?? "",
                  phone: data.profile.phone || null,
                  gender: data.profile.gender || null,
                },
                update: {
                  firstName: data.profile.firstName,
                  lastName: data.profile.lastName,
                  phone: data.profile.phone || null,
                  gender: data.profile.gender || null,
                },
              },
            }
          : undefined,
      },
      include: userWithRelations,
    });
    return user as unknown as UserRecord;
  },

  async setStatus(id: string, status: UserStatus): Promise<UserRecord> {
    const user = await prisma.user.update({
      where: { id },
      data: { status },
      include: userWithRelations,
    });
    return user as unknown as UserRecord;
  },

  /** Soft delete. */
  async softDelete(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), status: "INACTIVE" },
    });
  },
};
