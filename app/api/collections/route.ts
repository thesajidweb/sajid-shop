import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/connect";
import Collection from "@/lib/models/Collection";
import { CollectionSchema } from "@/lib/types/collectionType";
import { requirePermission } from "@/lib/auth/guards";
import { revalidateTag } from "next/cache";

export const GET = async () => {
  try {
    await connectToDB();
    const collections = await Collection.find().lean();

    return NextResponse.json(collections, { status: 200 });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 },
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const authSession = await requirePermission(request, "CREATE_COLLECTION");

    if (!authSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (authSession.user.role === "demo") {
      throw new Error("Demo mode: action not allowed");
    }
    // Validate with Zod
    const validatedData = CollectionSchema.parse(body);

    // Connect to MongoDB
    await connectToDB();

    // Insert into collections collection
    const collection = await Collection.create(validatedData);
    if (!collection) {
      return NextResponse.json(
        { error: "Failed to create collection" },
        { status: 500 },
      );
    }
    revalidateTag("collections", "default");

    return NextResponse.json({
      success: true,
      data: collection,
    });
  } catch (error) {
    console.error("Error creating collection:", error);
    return NextResponse.json(
      { error: "Failed to create collection" },
      { status: 500 },
    );
  }
};
