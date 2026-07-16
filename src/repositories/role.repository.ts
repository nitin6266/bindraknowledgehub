import { prisma } from "@/database/prisma";

import { ROLES, type Role as RoleName } from "@/constants/roles";

export const roleRepository = {
  async list() {
    return prisma.role.findMany({ orderBy: { name: "asc" } });
  },

  async getById(id: string) {
    return prisma.role.findUnique({ where: { id } });
  },

  async getByName(name: RoleName) {
    return prisma.role.findUnique({ where: { name } });
  },

  async getOrCreateByName(name: RoleName, label: string) {
    return prisma.role.upsert({
      where: { name },
      update: { label },
      create: { name, label },
    });
  },

  async ensureSeed() {
    const count = await prisma.role.count();
    if (count > 0) {
      return;
    }
    for (const name of Object.values(ROLES)) {
      const label = name
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
      await this.getOrCreateByName(name, label);
    }
  },
};
