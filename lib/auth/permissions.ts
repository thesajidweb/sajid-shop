import { Role } from "./validRole";

export const PERMISSIONS = {
  // Users
  CREATE_USER: ["admin"],
  VIEW_USERS: ["admin", "manager", "demo"],
  DELETE_USER: ["admin"],
  UPDATE_ROLE: ["admin"],
  RESET_PASSWORD: ["admin", "manager", "demo"],
  //Categories
  CREATE_CATEGORY: ["admin", "manager", "demo"],
  UPDATE_CATEGORY: ["admin", "manager", "demo"],
  DELETE_CATEGORY: ["admin"],

  // Collections
  CREATE_COLLECTION: ["admin", "manager", "demo"],
  UPDATE_COLLECTION: ["admin", "manager", "demo"],
  DELETE_COLLECTION: ["admin"],
  // Products
  CREATE_PRODUCT: ["admin", "manager", "demo"],
  UPDATE_PRODUCT: ["admin", "manager", "demo"],
  DELETE_PRODUCT: ["admin"],
  FULL_PRODUCT_DETAILS: ["admin", "manager", "demo"],

  //images
  MANAGE_IMAGES: ["admin", "manager", "demo"],

  // Orders
  CREATE_ORDER: ["admin", "manager", "demo", "order-manager", "customer"],
  VIEW_ORDER: ["admin", "manager", "demo", "order-manager", "customer"],
  UPDATE_ORDER: ["admin", "manager", "demo", "order-manager"],
  CANCEL_ORDER: ["admin", "manager", "demo", "order-manager", "customer"],

  // Analytics
  VIEW_ANALYTICS: ["admin", "manager", "demo"],

  // Reports
  VIEW_REPORTS: ["admin", "manager", "demo"],
  EXPORT_REPORTS: ["admin"],

  // Settings
  MANAGE_SETTINGS: ["admin"],
  MANAGE_ROLES: ["admin"],
};

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(role: Role, permission: Permission) {
  return PERMISSIONS[permission].includes(role);
}
