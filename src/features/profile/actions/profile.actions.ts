"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { userRepository } from "@/repositories/user.repository";
import { userService } from "@/services/user.service";
import { profileSchema, changePasswordSchema } from "@/features/profile/schemas/profile-schemas";
import type { ProfileValues, ChangePasswordValues } from "@/features/profile/schemas/profile-schemas";

export type ActionResult = { success: true } | { success: false; error: string };

async function currentLocalUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }
  return userRepository.getByAuthId(user.id);
}

export async function updateOwnProfileAction(values: ProfileValues): Promise<ActionResult> {
  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Validation failed. Please check the form." };
  }

  const local = await currentLocalUser();
  if (!local) {
    return { success: false, error: "Profile not found." };
  }

  await userRepository.update(local.id, { profile: parsed.data });
  revalidatePath("/dashboard/profile");
  return { success: true };
}

export async function changeOwnPasswordAction(values: ChangePasswordValues): Promise<ActionResult> {
  const parsed = changePasswordSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Validation failed. Please check the form." };
  }

  const local = await currentLocalUser();
  if (!local) {
    return { success: false, error: "Profile not found." };
  }

  const result = await userService.changeOwnPassword(
    parsed.data.currentPassword,
    parsed.data.newPassword,
  );
  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true };
}
