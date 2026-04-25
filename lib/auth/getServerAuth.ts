// todo this is used in only  server actions and  components do not use it on client side or api routes

import { connectToDB } from "../db/connect";
import { getServerSession } from "./getServerSession";
import { hasPermission, Permission } from "./permissions";
import { isValidRole } from "./validRole";

export async function getServerAuth(permission: Permission) {
  const session = await getServerSession();

  if (!session) return null;

  try {
    await connectToDB();

    const role = session.user.role;

    if (!isValidRole(role)) return null;

    if (!hasPermission(role, permission)) {
      throw new Error("403: Access Denied");
    }

    return session;
  } catch (error) {
    console.error("Server Auth Error:", error);
    return null;
  }
}
