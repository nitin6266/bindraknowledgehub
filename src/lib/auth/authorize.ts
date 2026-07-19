import { forbidden } from "next/navigation";

import { getUserRole } from "@/lib/auth/role";
import type { Role } from "@/constants/roles";

/**
 * Returns the current user's role, or `null` when unauthenticated.
 * Safe to call from server components and server actions.
 */
export async function getCurrentRole(): Promise<Role | null> {
  return getUserRole();
}

/**
 * Throws a 403 (Next `forbidden()`) when the current role is not allowed.
 * Use inside server components to guard a page.
 */
export async function assertRole(allowed: Role[]): Promise<Role> {
  const role = await getUserRole();
  if (!role || !allowed.includes(role)) {
    forbidden();
  }
  return role;
}

/**
 * Used inside server actions. Returns the role when allowed, otherwise `null`
 * so the caller can return a typed error instead of throwing.
 */
export async function authorizeAction(allowed: Role[]): Promise<Role | null> {
  const role = await getUserRole();
  if (!role || !allowed.includes(role)) {
    return null;
  }
  return role;
}
