import type { UserStatus } from "@prisma/client";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { roleRepository } from "@/repositories/role.repository";
import { userRepository, type UserRecord } from "@/repositories/user.repository";
import { auditService } from "@/services/audit.service";
import { type Role as RoleName } from "@/constants/roles";

export type CreateUserInput = {
  email: string;
  password: string;
  role: RoleName;
  firstName: string;
  lastName: string;
  phone?: string | null;
  gender?: string | null;
};

export type UpdateUserInput = {
  role?: RoleName;
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  gender?: string | null;
};

export type UserServiceResult = { success: true } | { success: false; error: string };

export type CreateUserResult =
  | { success: true; user: UserRecord }
  | { success: false; error: string };

export const userService = {
  async list(filter = {}) {
    return userRepository.list(filter);
  },

  async getById(id: string): Promise<UserRecord | null> {
    return userRepository.getById(id);
  },

  async getByAuthId(authId: string): Promise<UserRecord | null> {
    return userRepository.getByAuthId(authId);
  },

  /** Creates an auth user + ERP record + profile. */
  async create(input: CreateUserInput): Promise<CreateUserResult> {
    const admin = createAdminClient();

    // 1. Create the Supabase Auth user.
    const { data: authUser, error: authError } = await admin.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: { firstName: input.firstName, lastName: input.lastName },
      app_metadata: { role: input.role },
    });

    if (authError || !authUser.user) {
      return { success: false, error: authError?.message ?? "Failed to create auth user." };
    }

    try {
      const role = await roleRepository.getByName(input.role);
      if (!role) {
        return { success: false, error: "Invalid role." };
      }

      const user = await userRepository.create({
        authId: authUser.user.id,
        email: input.email,
        roleId: role.id,
        profile: {
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          gender: input.gender,
        },
      });

      await auditService.record("USER_CREATED", {
        entityType: "User",
        entityId: user.id,
        metadata: { email: input.email, role: input.role },
      });

      return { success: true, user };
    } catch (error) {
      // Roll back the auth user if the ERP record failed.
      await admin.auth.admin.deleteUser(authUser.user.id).catch(() => undefined);
      return { success: false, error: error instanceof Error ? error.message : "Failed to persist user." };
    }
  },

  async update(id: string, input: UpdateUserInput): Promise<UserServiceResult> {
    const existing = await userRepository.getById(id);
    if (!existing) {
      return { success: false, error: "User not found." };
    }

    const admin = createAdminClient();

    try {
      let roleId = existing.roleId;
      if (input.role && input.role !== existing.role.name) {
        const role = await roleRepository.getByName(input.role);
        if (!role) {
          return { success: false, error: "Invalid role." };
        }
        roleId = role.id;
        await admin.auth.admin.updateUserById(existing.authId, {
          app_metadata: { role: input.role },
        });
      }

      await userRepository.update(id, {
        roleId,
        profile: {
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          gender: input.gender,
        },
      });

      await auditService.record("USER_UPDATED", {
        entityType: "User",
        entityId: id,
        metadata: { changes: input },
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Failed to update user." };
    }
  },

  async resetPassword(authId: string, newPassword: string): Promise<UserServiceResult> {
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.updateUserById(authId, { password: newPassword });

    if (error) {
      return { success: false, error: error.message };
    }

    const user = await userRepository.getByAuthId(authId);
    await auditService.record("PASSWORD_RESET", {
      entityType: "User",
      entityId: user?.id ?? null,
    });

    return { success: true };
  },

  async setStatus(id: string, status: UserStatus): Promise<UserServiceResult> {
    const existing = await userRepository.getById(id);
    if (!existing) {
      return { success: false, error: "User not found." };
    }

    const admin = createAdminClient();
    const ban = status === "ACTIVE" ? "none" : "876600h";
    const { error } = await admin.auth.admin.updateUserById(existing.authId, {
      ban_duration: ban,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    await userRepository.setStatus(id, status);
    await auditService.record("STATUS_CHANGED", {
      entityType: "User",
      entityId: id,
      metadata: { status },
    });

    return { success: true };
  },

  async softDelete(id: string): Promise<UserServiceResult> {
    const existing = await userRepository.getById(id);
    if (!existing) {
      return { success: false, error: "User not found." };
    }

    const admin = createAdminClient();
    // Ban the auth user so they can no longer sign in.
    await admin.auth.admin.updateUserById(existing.authId, { ban_duration: "876600h" }).catch(() => undefined);

    await userRepository.softDelete(id);
    await auditService.record("USER_DELETED", {
      entityType: "User",
      entityId: id,
      metadata: { email: existing.email },
    });

    return { success: true };
  },

  async changeOwnPassword(currentPassword: string, newPassword: string): Promise<UserServiceResult> {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || !user.email) {
      return { success: false, error: "Not authenticated." };
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      return { success: false, error: "Current password is incorrect." };
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      return { success: false, error: error.message };
    }

    await auditService.record("PASSWORD_RESET", { entityType: "User", entityId: user.id });

    return { success: true };
  },
};
