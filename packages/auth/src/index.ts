import { UserRole } from "@repo/types";

export const PERMANENT_ADMINS = [
  "contact@maddybgmistore.in",
  "maddybgmistoreog@gmail.com",
  "r.mateshwaran.io@gmail.com"
];

export function isAdminRole(role: string): boolean {
  return ["SUPER_ADMIN", "ADMIN"].includes(role);
}

export function isManagerRole(role: string): boolean {
  return ["SUPER_ADMIN", "ADMIN", "TRANSACTION_MANAGER"].includes(role);
}

export function hasAdminAccess(email: string, role: string): boolean {
  if (PERMANENT_ADMINS.includes(email)) return true;
  return isAdminRole(role) || isManagerRole(role);
}
