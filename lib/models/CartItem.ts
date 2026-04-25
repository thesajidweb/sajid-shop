// models/Cart.ts

import { Schema, model, models, HydratedDocument, Types } from "mongoose";

/* =========================
   Cart Item Interface
========================= */

export interface ICartItem {
  productId: Types.ObjectId;
  name: string; // snapshot
  price: number; // snapshot price
  quantity: number;
  size: string;
  color: string;
  image: string;
  addedAt: Date;
}

/* =========================
   Cart Interface
========================= */

export interface ICart {
  userId?: Types.ObjectId;
  sessionId?: string;
  items: ICartItem[];
  couponCode?: string;
  discount?: number;
  total: number; // final payable amount
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/* =========================
   Cart Item Schema
========================= */

const cartItemSchema = new Schema<ICartItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String, required: true },
    color: { type: String, required: true },
    image: { type: String, required: true },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

/* =========================
   Cart Schema
========================= */

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    sessionId: {
      type: String,
      index: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    couponCode: String,
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      default: 0,
      min: 0,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/* =========================
   🔥 Auto Calculate Total
   Properly Typed "this"
========================= */

cartSchema.pre("save", function (this: HydratedDocument<ICart>) {
  let total = 0;

  for (const item of this.items) {
    total += item.price * item.quantity;
  }

  if (this.discount && this.discount > 0) {
    total -= this.discount;
  }

  this.total = total < 0 ? 0 : total;
});

/* =========================
   TTL Index (Auto Delete)
========================= */

cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/* =========================
   Export Model
========================= */

export const Cart = models.Cart || model<ICart>("Cart", cartSchema);
