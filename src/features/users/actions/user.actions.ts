"use server";

import { revalidatePath } from "next/cache";

import { authorizeAction, getCurrentRole } from "@/lib/auth/authorize";
import {
  canCreateRole,
  canManageUser,
  canResetPassword,
  canChangeStatus,
  canDeleteUser,
} from "@/lib/auth/permissions";
import { userService } from "@/services/user.service";
import { userRepository } from "@/repositories/user.repository";
import { ROLES, type Role } from "@/constants/roles";
import type { UserStatus } from "@prisma/client";

import { createUserSchema, updateUserSchema } from "@/features/users/schemas/user-schemas";
import type { CreateUserValues, UpdateUserValues } from "@/features/users/schemas/user-schemas";

export type ActionResult = { success: true } | { success: false; error: string };

const USERS_PATH = "/dashboard/admin/users";

async function targetRole(id: string): Promise<Role | null> {
  const user = await userRepository.getById(id);
  return (user?.role.name as Role) ?? null;
}

export async function createUserAction(values: CreateUserValues): Promise<ActionResult> {
  const parsed = createUserSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Validation failed. Please check the form." };
  }

  const actor = await authorizeAction([ROLES.SUPER_ADMIN, ROLES.ADMIN]);
  if (!actor) {
    return { success: false, error: "You are not authorized to create users." };
  }
  if (!canCreateRole(actor, parsed.data.role)) {
    return { success: false, error: `You cannot create a ${parsed.data.role} account.` };
  }

  const result = await userService.create(parsed.data);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath(USERS_PATH);
  return { success: true };
}

export async function updateUserAction(id: string, values: UpdateUserValues): Promise<ActionResult> {
  const parsed = updateUserSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Validation failed. Please check the form." };
  }

  const actor = await authorizeAction([ROLES.SUPER_ADMIN, ROLES.ADMIN]);
  if (!actor) {
    return { success: false, error: "You are not authorized to edit users." };
  }

  const target = await targetRole(id);
  if (!target || !canManageUser(actor, target)) {
    return { success: false, error: "You are not allowed to edit this user." };
  }

  const result = await userService.update(id, parsed.data);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath(USERS_PATH);
  return { success: true };
}

export async function resetPasswordAction(id: string, password: string): Promise<ActionResult> {
  const actor = await authorizeAction([ROLES.SUPER_ADMIN, ROLES.ADMIN]);
  if (!actor) {
    return { success: false, error: "You are not authorized." };
  }

  const target = await targetRole(id);
  if (!target || !canResetPassword(actor, target)) {
    return { success: false, error: "You are not allowed to reset this password." };
  }

  const user = await userRepository.getById(id);
  if (!user) {
    return { success: false, error: "User not found." };
  }

  const result = await userService.resetPassword(user.authId, password);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath(USERS_PATH);
  return { success: true };
}

export async function setUserStatusAction(id: string, status: UserStatus): Promise<ActionResult> {
  const actor = await authorizeAction([ROLES.SUPER_ADMIN, ROLES.ADMIN]);
  if (!actor) {
    return { success: false, error: "You are not authorized." };
  }

  const target = await targetRole(id);
  if (!target || !canChangeStatus(actor, target)) {
    return { success: false, error: "You are not allowed to change this user's status." };
  }

  const result = await userService.setStatus(id, status);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath(USERS_PATH);
  return { success: true };
}

export async function deleteUserAction(id: string): Promise<ActionResult> {
  const actor = await getCurrentRole();
  if (!actor) {
    return { success: false, error: "You are not authenticated." };
  }

  const target = await targetRole(id);
  if (!target || !canDeleteUser(actor, target)) {
    return { success: false, error: "You are not allowed to delete this user." };
  }

  const result = await userService.softDelete(id);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath(USERS_PATH);
  return { success: true };
}
