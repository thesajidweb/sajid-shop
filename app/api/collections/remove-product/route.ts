// app/api/collections/remove-product/route.ts
import { requirePermission } from "@/lib/auth/guards";
import { connectToDB } from "@/lib/db/connect";
import Collection from "@/lib/models/Collection";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { collectionId, productId } = await req.json();
  const authSession = await requirePermission(req, "UPDATE_COLLECTION");

  if (!authSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (authSession.user.role === "demo") {
    throw new Error("Demo mode: action not allowed");
  }
  await connectToDB();

  const collectionUpdated = await Collection.findByIdAndUpdate(collectionId, {
    $pull: { products: productId },
  });
  if (!collectionUpdated) {
    return NextResponse.json(
      { error: "Collection not found" },
      { status: 404 },
    );
  }

  revalidateTag(`collection-${collectionId}`, "default");

  return NextResponse.json({ success: true });
}
