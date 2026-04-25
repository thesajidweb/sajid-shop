import { NextRequest } from "next/server";
import mongoose from "mongoose";

import { connectToDB } from "@/lib/db/connect";
import User from "@/lib/models/User";
import Account from "@/lib/models/Account";
import Session from "@/lib/models/Session";

import { ApiError } from "@/lib/utils/api-error";

import { requirePermission } from "@/lib/auth/guards";
import { updateRoleSchema } from "@/lib/auth/validRole";
import { apiResponse } from "@/lib/utils/api-response";
import { revalidateSessions } from "@/lib/auth/revalidateSessions";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // ✅ ObjectId validation
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return apiResponse("Invalid user id", 400);
  }

  // ✅ Permission check
  const authSession = await requirePermission(req, "DELETE_USER");

  if (!authSession) {
    return apiResponse("Unauthorized", 401);
  }
  if (authSession.user.role === "demo") {
    throw new Error("Demo mode: action not allowed");
  }

  // ✅ Prevent self delete
  if (authSession.user.id === id) {
    return apiResponse("You cannot delete yourself", 403);
  }

  let sessionDB: mongoose.ClientSession | null = null;

  try {
    await connectToDB();

    // ✅ start session
    sessionDB = await mongoose.startSession();
    sessionDB.startTransaction();

    const user = await User.findByIdAndDelete(id).session(sessionDB);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    await Promise.all([
      Account.deleteMany({ userId: id }).session(sessionDB),
      Session.deleteMany({ userId: id }).session(sessionDB),
    ]);

    // ✅ commit
    await sessionDB.commitTransaction();

    return apiResponse("User deleted successfully", 200);
  } catch (error: unknown) {
    // ✅ safe abort
    if (sessionDB) {
      await sessionDB.abortTransaction();
    }

    if (error instanceof ApiError) {
      return apiResponse(error.message, error.status);
    }

    console.error("Delete User Error:", error);

    return apiResponse("Something went wrong please try again", 500);
  } finally {
    // ✅ safe end
    if (sessionDB) {
      sessionDB.endSession();
    }
  }
}
// ================= UPDATE ROLE =================
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // ✅ Permission check
    const authSession = await requirePermission(req, "UPDATE_ROLE");

    if (!authSession) {
      return apiResponse("Unauthorized", 401);
    }
    if (authSession.user.role === "demo") {
      throw new Error("Demo mode: action not allowed");
    }
    await connectToDB();

    const { id } = await params;

    const body = await req.json();

    // Zod validation
    const parsed = updateRoleSchema.safeParse(body);

    if (!parsed.success) {
      throw new ApiError(parsed.error.issues[0].message, 400);
    }

    const { role } = parsed.data;

    // ❗ Prevent self role change
    if (authSession.user.id === id) {
      throw new ApiError("You cannot change your own role", 403);
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true });

    if (!user) {
      throw new ApiError("User not found", 404);
    }
    await revalidateSessions();

    return apiResponse("Role updated successfully", 200, user);
  } catch (error: unknown) {
    // ✅ Known error
    if (error instanceof ApiError) {
      return apiResponse(error.message, error.status);
    }

    // ❗ Unknown error (important)
    console.error("Unexpected Error:", error);

    return apiResponse("Internal Server Error", 500);
  }
}
