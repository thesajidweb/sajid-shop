import { connectToDB } from "@/lib/db/connect";
import Product from "@/lib/models/Product";

import { NextRequest, NextResponse } from "next/server";
import { ProductType } from "@/lib/types/ProductType";
import mongoose from "mongoose";
import { deleteMultipleImage } from "@/lib/imagekit/imageKitService";
import Collection from "@/lib/models/Collection";
import {
  dashboardProductFields,
  storefrontProductFields,
} from "@/lib/db/product.projection";
import { calculateDiscountPrice } from "@/lib/utils/priceCalculator";
import { requirePermission } from "@/lib/auth/guards";
import { revalidateTag } from "next/cache";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const authSession = await requirePermission(
      request,
      "FULL_PRODUCT_DETAILS",
    );

    const dashboard = request.headers.get("dashboard");
    const isDashboardView = dashboard && authSession?.user.role === "admin";
    const fields = isDashboardView
      ? dashboardProductFields
      : storefrontProductFields;
    const { id } = await params;

    await connectToDB();

    const product = await Product.findById(id)
      .select(fields)
      .lean<ProductType | null>();
    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }
    const finalPrice = calculateDiscountPrice(product.price, product.discount);
    const productData = {
      ...product,
      finalPrice,
    };
    return NextResponse.json(productData, { status: 200 });
  } catch (error) {
    console.error("[product_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    const authSession = await requirePermission(request, "DELETE_PRODUCT");

    if (!authSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (authSession.user.role === "demo") {
      return NextResponse.json({ success: false, id }, { status: 400 });
    }
    await connectToDB();
    const product = await Product.findById(id);

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }
    const imageIds =
      product.gallery
        ?.map((img) => img.fileId)
        .filter((id): id is string => Boolean(id)) ?? [];

    if (imageIds.length > 0) {
      await deleteMultipleImage(imageIds);
    }

    /*
    if (imageIds.length > 0) {
      const imageDeleteResult = await deleteMultipleImage(imageIds);

      //  If image deletion failed → STOP to delete from db
      if (!imageDeleteResult) {
        return new NextResponse("Failed to delete product images", {
          status: 500,
        });
      }
    } */
    //  Delete product
    const deletedProduct = await Product.findByIdAndDelete(id);
    await Collection.updateMany({ products: id }, { $pull: { products: id } });

    if (!deletedProduct) {
      return new NextResponse("Failed to delete product", { status: 500 });
    }
    revalidateTag("products", "default");
    revalidateTag(`product-${id}`, "default");
    return NextResponse.json({ success: true, id }, { status: 200 });
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const authSession = await requirePermission(request, "UPDATE_PRODUCT");

    if (!authSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (authSession.user.role === "demo") {
      return NextResponse.json({ success: false, id }, { status: 400 });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new NextResponse("Invalid product ID", { status: 400 });
    }
    await connectToDB();
    const body: ProductType = await request.json();
    // Delete product id before update
    delete body._id;
    body.finalPrice = calculateDiscountPrice(body.price, body.discount);
    // updated product
    const updatedProduct = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) {
      return new NextResponse("Product not found", { status: 404 });
    }

    revalidateTag(`products`, "default");
    revalidateTag(`product-${id}`, "default");

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("[PRODUCT_UPDATE]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
