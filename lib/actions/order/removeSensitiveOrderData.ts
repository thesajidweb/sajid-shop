import { OrderType } from "@/lib/types/order";

// Helper function to strip sensitive data from orders
export const removeSensitiveOrderData = (order: any): Partial<OrderType> => {
  return {
    _id: order._id,
    userId: order.userId,
    // Remove cost and revenue fields from items
    items: order.items.map((item: any) => ({
      productId: item.productId,
      name: item.name,
      color: item.color,
      colorCode: item.colorCode,
      size: item.size,
      price: item.price,
      // cost: undefined, // REMOVED - sensitive
      quantity: item.quantity,
      image: item.image,
    })),
    shippingAddress: order.shippingAddress,
    shippingMethod: order.shippingMethod,
    paymentMethod: order.paymentMethod,
    subtotal: order.subtotal,
    shipping: order.shipping,
    tax: order.tax,
    total: order.total,
    // totalCost: undefined, // REMOVED - sensitive
    // totalRevenue: undefined, // REMOVED - sensitive
    orderStatus: order.orderStatus,
    editableUntil: order.editableUntil,
    cancelledAt: order.cancelledAt,
    isHiddenByUser: order.isHiddenByUser,
    isArchived: order.isArchived,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt,
  };
};
