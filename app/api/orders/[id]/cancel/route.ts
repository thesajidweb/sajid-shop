import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/connect";
import { Order } from "@/lib/models/Order";
import Product from "@/lib/models/Product";

import { requireAuth } from "@/lib/auth/guards";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const authSession = await requireAuth(req);

  if (!authSession) {
    throw new Error("Unauthorized");
  }
  await connectToDB();

  const order = await Order.findById(id);
  if (!order)
    return NextResponse.json({ error: "Order not found" }, { status: 404 });

  if (order.orderStatus === "cancelled") {
    return NextResponse.json({ error: "Already cancelled" }, { status: 400 });
  }

  if (new Date() > order.editableUntil) {
    return NextResponse.json({ error: "Cancel time expired" }, { status: 400 });
  }

  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: item.quantity },
    });
  }

  order.orderStatus = "cancelled";
  order.cancelledAt = new Date();

  await order.save();

  return NextResponse.json({ success: true, order });
}
