/**
 * Public routes that do not require authentication.
 */
export const PUBLIC_ROUTES: string[] = ["/login", "/forgot-password", "/reset-password"];

/**
 * Protected ERP route prefixes.
 */
export const PROTECTED_ROUTE_PREFIXES: string[] = ["/dashboard"];

/**
 * Role-specific route prefixes.
 */
export const ROLE_ROUTES: Record<string, string> = {
  SUPER_ADMIN: "/dashboard/admin",
  ADMIN: "/dashboard/admin",
  TEACHER: "/dashboard/teacher",
  PARENT: "/dashboard/parent",
} as const;
