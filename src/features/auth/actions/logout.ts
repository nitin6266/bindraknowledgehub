"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { clearRoleCookie } from "@/lib/auth/role";
import { auditService } from "@/services/audit.service";

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await auditService.record("LOGOUT");
  await supabase.auth.signOut();
  await clearRoleCookie();
  redirect("/login");
}
