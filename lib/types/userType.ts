export type UserRole = "admin" | "manager" | "order-manager" | "customer";

export interface User {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role?: string;
  createdAt: string;
  updatedAt: string;
}
