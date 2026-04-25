import { z } from "zod";

export const ROLES = [
  "admin",
  "manager",
  "order-manager",
  "customer",
  "demo",
] as const;

export type Role = (typeof ROLES)[number];

export function isValidRole(role: unknown): role is Role {
  return typeof role === "string" && ROLES.includes(role as Role);
}

export const updateRoleSchema = z.object({
  role: z.enum(ROLES),
});
