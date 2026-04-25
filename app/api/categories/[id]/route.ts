import { requirePermission } from "@/lib/auth/guards";
import { connectToDB } from "@/lib/db/connect";
import { Category } from "@/lib/models/Category";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const authSession = await requirePermission(request, "UPDATE_CATEGORY");

    if (!authSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (authSession.user.role === "demo") {
      throw new Error("Demo mode: action not allowed");
    }
    await connectToDB();

    const body = await request.json();

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name: body.name,
        subcategories: body.subcategories,
      },
      { new: true, runValidators: true },
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 },
      );
    }
    revalidateTag("categories", "default");

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error("CATEGORY_UPDATE_ERROR:", error);

    return NextResponse.json(
      { message: "Failed to update category" },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const authSession = await requirePermission(request, "DELETE_CATEGORY");

    if (!authSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (authSession.user.role === "demo") {
      throw new Error("Demo mode: action not allowed");
    }
    await connectToDB();

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 },
      );
    }
    revalidateTag("categories", "default");
    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("CATEGORY_DELETE_ERROR:", error);

    return NextResponse.json(
      { message: "Failed to delete category" },
      { status: 500 },
    );
  }
};
