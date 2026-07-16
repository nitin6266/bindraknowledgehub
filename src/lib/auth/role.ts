import { cookies } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import { ROLES, type Role } from "@/constants/roles";

const ROLE_COOKIE_NAME = "bkh-erp-role";

/**
 * Extracts the ERP role from the current Supabase user app_metadata.
 * Falls back to a cached role cookie for SSR when the session is still valid.
 */
export async function getUserRole(): Promise<Role | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const roleFromMetadata = user.app_metadata?.["role"] as Role | undefined;
  if (roleFromMetadata && isValidRole(roleFromMetadata)) {
    return roleFromMetadata;
  }

  const cookieStore = await cookies();
  const roleCookie = cookieStore.get(ROLE_COOKIE_NAME);
  if (roleCookie && isValidRole(roleCookie.value as Role)) {
    return roleCookie.value as Role;
  }

  return null;
}

/**
 * Stores the user role in a client-readable cookie for fast SSR decisions.
 */
export async function setRoleCookie(role: Role): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ROLE_COOKIE_NAME, role, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearRoleCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ROLE_COOKIE_NAME);
}

function isValidRole(value: Role | string): value is Role {
  return Object.values(ROLES).includes(value as Role);
}
