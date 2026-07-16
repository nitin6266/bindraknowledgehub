/**
 * ERP role definitions.
 * Stored as a const object to enable strict typing with `as const`.
 */
export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  PARENT: "PARENT",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_HIERARCHY: Record<Role, number> = {
  [ROLES.SUPER_ADMIN]: 4,
  [ROLES.ADMIN]: 3,
  [ROLES.TEACHER]: 2,
  [ROLES.PARENT]: 1,
} as const;

/**
 * Maps each role to its default dashboard landing path.
 */
export const ROLE_DEFAULT_DASHBOARD: Record<Role, string> = {
  [ROLES.SUPER_ADMIN]: "/dashboard/admin",
  [ROLES.ADMIN]: "/dashboard/admin",
  [ROLES.TEACHER]: "/dashboard/teacher",
  [ROLES.PARENT]: "/dashboard/parent",
} as const;
