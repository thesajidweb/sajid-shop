import { requirePermission } from "@/lib/auth/guards";
import {
  deleteImage,
  deleteMultipleImage,
} from "@/lib/imagekit/imageKitService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const authSession = await requirePermission(req, "MANAGE_IMAGES");

    if (!authSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (authSession.user.role === "demo") {
      throw new Error("Demo mode: action not allowed");
    }

    const { fileIds }: { fileIds: string[] } = await req.json();

    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      return NextResponse.json(
        { message: "fileIds array is required" },
        { status: 400 },
      );
    }

    if (fileIds.length === 1) {
      await deleteImage(fileIds[0]);
      return NextResponse.json(
        {
          message: "Delete process completed",
          successCount: 1,
          failedCount: 0,
        },
        { status: 200 },
      );
    } else {
      await deleteMultipleImage(fileIds);
      return NextResponse.json(
        {
          message: "Delete process completed",
          successCount: fileIds.length,
          failedCount: 0,
        },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error("[DELETE IMAGE]", error);
    return NextResponse.json(
      { message: "Failed to delete images" },
      { status: 500 },
    );
  }
}
