import { Schema, model, models, Types, Document } from "mongoose";

export interface IOrderItem {
  productId: Types.ObjectId;
  name: string;
  color?: string;
  colorCode?: string;
  size: string;
  price: number;
  cost: number; // This field will be hidden from regular users
  quantity: number;
  image?: string;
}

export interface IOrder extends Document {
  userId: Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: {
    label: string;
    fullName: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    landmark: string;
    zipCode: string;
    country: string;
  };
  shippingMethod: string;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  totalCost: number; // Sensitive - hide from users
  totalRevenue: number; // Sensitive - hide from users
  orderStatus: string;
  editableUntil: Date;
  cancelledAt: Date;
  isHiddenByUser: boolean;
  isArchived: boolean;
  paymentStatus: string;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        color: String,
        colorCode: String,
        size: String,
        price: Number,
        cost: {
          type: Number,
          required: true,
          // This field should only be visible in admin/bot contexts
          select: false, // Don't select by default - requires explicit selection
        },
        quantity: Number,
        image: String,
      },
    ],
    shippingAddress: {
      label: String,
      fullName: String,
      phone: String,
      address: String,
      city: String,
      province: String,
      landmark: String,
      zipCode: String,
      country: String,
    },
    shippingMethod: String,
    paymentMethod: String,
    subtotal: Number,
    shipping: Number,
    tax: Number,
    total: Number,
    totalCost: {
      type: Number,
      select: false, // Hidden by default
    },
    totalRevenue: {
      type: Number,
      select: false, // Hidden by default
    },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    isHiddenByUser: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    editableUntil: Date,
    cancelledAt: Date,
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true },
);

OrderSchema.index({ createdAt: -1, orderStatus: 1, paymentStatus: 1 });
OrderSchema.index({ orderStatus: 1, paymentStatus: 1, createdAt: -1 });
OrderSchema.index({ "items.productId": 1 });

export const Order = models.Order || model<IOrder>("Order", OrderSchema);
