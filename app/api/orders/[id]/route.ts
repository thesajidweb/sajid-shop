import { requireAuth, requirePermission } from "@/lib/auth/guards";
import { connectToDB } from "@/lib/db/connect";
import { Order } from "@/lib/models/Order";
import { OrderType } from "@/lib/types/order";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const authSession = await requireAuth(req);
    if (!authSession) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    await connectToDB();

    const order = await Order.findById(id).lean();
    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("[order_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requirePermission(request, "UPDATE_ORDER");
    const { id } = await params;
    const body = await request.json();
    const { orderStatus, paymentStatus } = body;

    const updateData: Partial<OrderType> = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    await connectToDB();

    const order = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
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

    const authSession = await requireAuth(request);
    if (!authSession) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    await connectToDB();

    // First find the order to check its status
    const existingOrder = await Order.findById(id).lean();

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if order status is delivered or cancelled
    const orderStatus = existingOrder.orderStatus;
    const allowedStatuses = ["delivered", "cancelled"];

    if (!allowedStatuses.includes(orderStatus)) {
      return NextResponse.json(
        {
          error: `Cannot archive order with status "${orderStatus}". Only delivered or cancelled orders can be deleted.`,
          currentStatus: orderStatus,
          allowedStatuses: allowedStatuses,
        },
        { status: 400 },
      );
    }

    // Check if order is already archived
    if (existingOrder.isArchived) {
      return NextResponse.json(
        { error: "Order is already deleted" },
        { status: 400 },
      );
    }

    // Proceed with archiving
    const order = await Order.findByIdAndUpdate(
      id,
      { isArchived: true },
      { new: true, runValidators: true },
    ).lean();

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
      order,
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 },
    );
  }
}
