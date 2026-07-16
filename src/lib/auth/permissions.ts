import { ROLES, type Role } from "@/constants/roles";

/**
 * Role-based permission matrix for user management.
 * Reflects the rules in Sprint 2 (BKH-ERP-002).
 */

const CREATABLE_BY: Record<Role, Role[]> = {
  [ROLES.SUPER_ADMIN]: [ROLES.ADMIN, ROLES.TEACHER, ROLES.PARENT],
  [ROLES.ADMIN]: [ROLES.TEACHER, ROLES.PARENT],
  [ROLES.TEACHER]: [],
  [ROLES.PARENT]: [],
};

/** Whether `actor` is allowed to open the user management console. */
export function canAccessUserManagement(actor: Role | null): boolean {
  return actor === ROLES.SUPER_ADMIN || actor === ROLES.ADMIN;
}

/** Whether `actor` may create a user with `target` role. */
export function canCreateRole(actor: Role | null, target: Role): boolean {
  if (!actor) {
    return false;
  }
  return CREATABLE_BY[actor]?.includes(target) ?? false;
}

/** Whether `actor` may edit/manage a user whose role is `target`. */
export function canManageUser(actor: Role | null, target: Role): boolean {
  if (!actor) {
    return false;
  }
  if (actor === ROLES.SUPER_ADMIN) {
    return true;
  }
  if (actor === ROLES.ADMIN) {
    return target === ROLES.TEACHER || target === ROLES.PARENT;
  }
  return false;
}

/** Whether `actor` may reset the password of a user with `target` role. */
export function canResetPassword(actor: Role | null, target: Role): boolean {
  return canManageUser(actor, target);
}

/** Whether `actor` may change the active/inactive status of `target`. */
export function canChangeStatus(actor: Role | null, target: Role): boolean {
  return canManageUser(actor, target);
}

/** Whether `actor` may soft-delete a user with `target` role. */
export function canDeleteUser(actor: Role | null, target: Role): boolean {
  return canManageUser(actor, target);
}
