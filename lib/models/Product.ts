import { Schema, model, models, Model, Document } from "mongoose";

/* ---------------- Types ---------------- */

export interface IProductDocument extends Document {
  name: string;
  price: number;
  finalPrice: number;
  cost: number;
  category: string;
  subcategory?: string;
  brand?: string;

  gallery: {
    url: string;
    fileId?: string;
  }[];

  shortDescription?: string;
  description?: string;

  variants: {
    colorCode: string;
    colorName: string;
    sizes: {
      size: string;
      stock: number;
    }[];
  }[];

  status: "active" | "inactive" | "draft";
  isFeatured: boolean;

  warranty: {
    type: "none" | "manufacturer" | "seller";
    period?: number;
    unit?: "day" | "month" | "year" | "lifetime";
    policy?: string;
  };

  discount?: {
    type: "percentage" | "fixed" | "none";
    value: number;
  };

  salesCount: number; // Lifetime sold
  lastSoldAt?: Date;
  shippingWeight?: number;
  totalRevenue: number; // Lifetime revenue
  totalProfit: number; // Lifetime profit (Revenue - (cost * quantity))

  ratingsCount: number; // total users who rated
  averageRating: number; // pre-calculated average

  createdAt: Date;
  updatedAt: Date;
}

/* ---------------- Schema ---------------- */

const ProductSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    finalPrice: { type: Number, min: 0 },
    cost: { type: Number, default: 0, min: 0 },

    category: { type: String, required: true },
    subcategory: { type: String },
    brand: { type: String },

    gallery: [
      {
        url: { type: String, required: true },
        fileId: { type: String },
      },
    ],

    shortDescription: { type: String },
    description: { type: String },

    variants: [
      {
        colorCode: { type: String, required: true },
        colorName: { type: String, required: true },
        sizes: [
          {
            size: { type: String, required: true },
            stock: { type: Number, default: 0, min: 0 },
          },
        ],
      },
    ],

    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "draft",
    },

    isFeatured: { type: Boolean, default: false },

    warranty: {
      type: {
        type: String,
        enum: ["none", "manufacturer", "seller"],
        default: "none",
      },
      period: { type: Number },
      unit: { type: String, enum: ["day", "month", "year", "lifetime"] },
      policy: { type: String },
    },

    discount: {
      type: {
        type: String,
        enum: ["percentage", "fixed", "none"],
        default: "none",
      },
      value: { type: Number, default: 0 },
    },

    salesCount: { type: Number, default: 0 },
    lastSoldAt: { type: Date },
    shippingWeight: { type: Number, min: 0 },
    totalRevenue: { type: Number, default: 0 },
    totalProfit: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true },
);
ProductSchema.pre("save", function () {
  let final = this.price;

  if (this.discount?.type === "percentage") {
    final -= (final * this.discount.value) / 100;
  }

  if (this.discount?.type === "fixed") {
    final -= this.discount.value;
  }

  if (final < 0) final = 0;

  this.finalPrice = final;
});
/* ---------------- Indexes ---------------- */

// Search
ProductSchema.index({ name: "text", brand: "text" });

// Filters
ProductSchema.index({ category: 1, subcategory: 1 });

// Sorting
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ updatedAt: -1 });
ProductSchema.index({ cost: 1 });
ProductSchema.index({ "variants.sizes.stock": 1 });

/* ---------------- Model ---------------- */

const Product =
  (models.Product as Model<IProductDocument>) ||
  model<IProductDocument>("Product", ProductSchema);

export default Product;
