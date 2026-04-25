import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/connect";
import { Category } from "@/lib/models/Category";
import { categorySchema } from "@/lib/types/categoryType";
import { requirePermission } from "@/lib/auth/guards";
import { revalidateTag } from "next/cache";

/**
 * GET /api/categories
 * Fetch all categories from the database
 */
export async function GET() {
  try {
    await connectToDB();

    const categories = await Category.find({}).lean(); // Use lean() for plain JS objects
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/categories
 * Create a new category
 */
export async function POST(request: NextRequest) {
  try {
    const authSession = await requirePermission(request, "CREATE_CATEGORY");

    if (!authSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (authSession.user.role === "demo") {
      throw new Error("Demo mode: action not allowed");
    }
    await connectToDB();

    const body = await request.json();
    const newCategory = categorySchema.parse(body); // Validate input with Zod

    const existing = await Category.findOne({ name: newCategory.name });
    if (existing) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400 },
      );
    }

    const category = await Category.create(newCategory);
    revalidateTag("categories", "default");

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Failed to create category:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 },
    );
  }
}
