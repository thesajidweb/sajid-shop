// todo  this is used in only api routes do not use it in server actions , components or client components


import { NextRequest } from "next/server";
import { hasPermission, Permission } from "./permissions";
import { isValidRole } from "./validRole";
import { getAuth } from ".";

export async function requireAuth(req: NextRequest) {
  
  const auth = await getAuth();
const session = await auth.api.getSession({
 headers: req.headers,
});

  return session ?? null;
}

export async function requirePermission(
  req: NextRequest,
  permission: Permission,
) {
  const session = await requireAuth(req);

  //  not logged in
  if (!session) {
    return null;
  } else {
    try {
      const role = session.user.role;

      //  invalid role
      if (!isValidRole(role)) return null;

      if (!hasPermission(role, permission)) {
        throw new Error("403: Access Denied");
      }
      return session;
    } catch (error) {
      console.error("Auth Guard Error:", error);

      //  fail safe (never crash)
      return null;
    }
  }
}
