"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { setRoleCookie } from "@/lib/auth/role";
import { auditService } from "@/services/audit.service";
import { ROLE_DEFAULT_DASHBOARD, type Role } from "@/constants/roles";

export type LoginResult =
  | { success: true; redirectTo: string }
  | { success: false; error: string };

export async function login(formData: FormData): Promise<LoginResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { success: false, error: error?.message ?? "Invalid credentials." };
  }

  const role = (data.user.app_metadata?.["role"] as Role) ?? null;

  if (role) {
    await setRoleCookie(role);
  }

  const redirectTo = role ? ROLE_DEFAULT_DASHBOARD[role] : "/dashboard";

  await auditService.record("LOGIN", { entityType: "User", entityId: data.user.id });

  redirect(redirectTo);
}
