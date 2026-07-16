/**
 * Shared formatting helpers for the ERP.
 */

export function formatInitials(nameOrEmail: string): string {
  if (!nameOrEmail) {
    return "U";
  }
  return nameOrEmail.slice(0, 2).toUpperCase();
}

export function formatRoleLabel(role: string): string {
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
