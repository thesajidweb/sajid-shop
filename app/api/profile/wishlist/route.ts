// app/api/profile/wishlist/route.ts
import { requireAuth } from "@/lib/auth/guards";
import { connectToDB } from "@/lib/db/connect";
import { storefrontProductFields } from "@/lib/db/product.projection";
import Product from "@/lib/models/Product";
import { UserProfile } from "@/lib/models/userProfile";
import { NextRequest, NextResponse } from "next/server";

// ✅ POST: Add to wishlist
export async function POST(req: NextRequest) {
  try {
    // ✅ First authenticate
    const authSession = await requireAuth(req);
    if (!authSession) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please login first" },
        { status: 401 },
      );
    }

    const userId = authSession.user.id;
    const { productId } = await req.json();

    // ✅ Validate productId
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    await connectToDB();

    // ✅ Update or create user profile
    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      {
        $addToSet: {
          wishlistItems: { productId }, // ✅ prevents duplicates
        },
      },
      { new: true, upsert: true },
    );

    return NextResponse.json({
      success: true,
      message: "Product added to wishlist",
      wishlist: profile.wishlistItems,
    });
  } catch (error) {
    console.error("❌ Wishlist POST error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Internal server error", message: error.message },
        { status: 500 },
      );
    }
  }
}

// ✅ DELETE: Remove from wishlist
export async function DELETE(req: NextRequest) {
  try {
    // ✅ First authenticate
    const authSession = await requireAuth(req);
    if (!authSession) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please login first" },
        { status: 401 },
      );
    }

    const userId = authSession.user.id;
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    await connectToDB();

    // ✅ Remove from wishlist
    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      {
        $pull: {
          wishlistItems: { productId },
        },
      },
      { new: true },
    );

    if (!profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product removed from wishlist",
      wishlist: profile.wishlistItems,
    });
  } catch (error) {
    console.error("❌ Wishlist DELETE error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Internal server error", message: error.message },
        { status: 500 },
      );
    }
  }
}

// ✅ GET: Fetch wishlist
export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get("ids");

    const ids = idsParam ? JSON.parse(idsParam) : [];

    if (!ids.length) {
      return NextResponse.json({
        success: true,
        wishlistItems: [],
      });
    }

    const products = await Product.find({
      _id: { $in: ids },
    }).select(storefrontProductFields);

    return NextResponse.json({
      success: true,
      wishlistItems: products,
    });
  } catch (error) {
    console.error("❌ Wishlist GET error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
