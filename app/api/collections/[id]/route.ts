import { requirePermission } from "@/lib/auth/guards";
import { connectToDB } from "@/lib/db/connect";
import {
  projectionToSelect,
  storefrontProductFields,
} from "@/lib/db/product.projection";
import { deleteImage } from "@/lib/imagekit/imageKitService";
import Collection from "@/lib/models/Collection";
import "@/lib/models/Product";
import { CollectionType } from "@/lib/types/collectionType";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const populate = request.nextUrl.searchParams.get("populate");
  try {
    const { id } = await params;

    await connectToDB();

    const collection = populate
      ? await Collection.findById(id)
          .populate({
            path: "products",
            select: projectionToSelect(storefrontProductFields),
          })
          .lean()
      : await Collection.findById(id).lean();

    if (!collection) {
      return NextResponse.json(
        { message: "Collection not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        ...collection,
        _id: collection._id.toString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching collection:", error);
    return NextResponse.json(
      { message: "Error fetching collection" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const authSession = await requirePermission(request, "UPDATE_COLLECTION");

    if (!authSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (authSession.user.role === "demo") {
      throw new Error("Demo mode: action not allowed");
    }
    const body: CollectionType = await request.json();

    await connectToDB();

    // update collection
    const updatedCollection = await Collection.findByIdAndUpdate(
      id,
      {
        title: body.title,
        description: body.description,
        image: body.image,
        products: body.products,
      },
      {
        new: true, // return updated doc
        runValidators: true, // mongoose validation
      },
    );

    if (!updatedCollection) {
      return NextResponse.json(
        { message: "Collection not found" },
        { status: 404 },
      );
    }

    revalidateTag(`collection`, "default");
    revalidateTag(`collection-${id}`, "default");
    return NextResponse.json(
      {
        ...updatedCollection.toObject(),
        _id: updatedCollection._id.toString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[COLLECTION_PUT]", error);
    return NextResponse.json(
      { message: "Failed to update collection" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const authSession = await requirePermission(request, "DELETE_COLLECTION");

    if (!authSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (authSession.user.role === "demo") {
      throw new Error("Demo mode: action not allowed");
    }
    await connectToDB();

    const collection = await Collection.findById(id);
    if (!collection) {
      return NextResponse.json(
        { success: false, message: "Collection not found" },
        { status: 404 },
      );
    }
    // Delete image if exists
    if (collection.image?.fileId) {
      const imageDeleted = await deleteImage(collection.image.fileId);
      if (!imageDeleted) {
        return NextResponse.json(
          { success: false, message: "Failed to delete collection image" },
          { status: 500 },
        );
      }
    }
    await Collection.findByIdAndDelete(id);

    // ✅ the way to revalidate in Route Handler
    revalidateTag("collections", "default");
    revalidateTag(`collection-${id}`, "default");
    return NextResponse.json(
      { success: true, message: "Collection deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("[collection_DELETE]", error);

    return NextResponse.json(
      { success: false, message: "Error deleting collection" },
      { status: 500 },
    );
  }
}
