import * as z from "zod";

/* ---------------- Discount ---------------- */
export const DiscountSchema = z
  .object({
    type: z.enum(["none", "percentage", "fixed"]).default("none"),
    value: z.coerce.number().default(0),
  })
  .superRefine((d, ctx) => {
    /* ---------- no discount ---------- */
    if (d.type === "none") {
      if (d.value !== 0) {
        ctx.addIssue({
          path: ["value"],
          message: "Discount value must be 0 when type is none",
          code: z.ZodIssueCode.custom,
        });
      }
      return;
    }

    /* ---------- value rules ---------- */
    if (d.value <= 0) {
      ctx.addIssue({
        path: ["value"],
        message: "Discount value must be greater than 0",
        code: z.ZodIssueCode.custom,
      });
    }

    if (d.type === "percentage" && d.value > 100) {
      ctx.addIssue({
        path: ["value"],
        message: "Discount percentage cannot exceed 100%",
        code: z.ZodIssueCode.custom,
      });
    }
  });

/* ---------------- Variant ---------------- */
const VariantSchema = z
  .object({
    colorCode: z
      .string()
      .regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid hex code")
      .transform((v) => v.toLowerCase()),

    colorName: z.string().trim().min(1, "Color name is required"),

    sizes: z
      .array(
        z.object({
          size: z
            .string()
            .trim()
            .min(1, "Size is required")
            .max(50, "Size is too long"),
          stock: z.coerce
            .number()
            .int()
            .min(0, "Stock cannot be negative")
            .default(0),
        }),
      )
      .min(1, "At least one size is required"),
  })
  .superRefine((v, ctx) => {
    /*  At least one size must have stock */
    const hasStock = v.sizes.some((s) => s.stock > 0);
    if (!hasStock) {
      ctx.addIssue({
        path: ["sizes"],
        message: "At least one size must have stock > 0",
        code: z.ZodIssueCode.custom,
      });
    }

    /*  No duplicate sizes (case-insensitive) */
    const normalizedSizes = v.sizes.map((s) => s.size.toLowerCase());
    const uniqueSizes = new Set(normalizedSizes);

    if (uniqueSizes.size !== normalizedSizes.length) {
      ctx.addIssue({
        path: ["sizes"],
        message: "Duplicate sizes are not allowed",
        code: z.ZodIssueCode.custom,
      });
    }
  });

/* ---------------- Warranty ---------------- */

export const WarrantyUnits = ["day", "month", "year"] as const;

export const WarrantTypes = ["none", "manufacturer", "seller"] as const;
export const WarrantySchema = z
  .object({
    type: z.enum(WarrantTypes).default("none"),
    period: z.coerce.number().optional(),
    unit: z.enum(WarrantyUnits).optional(),
    policy: z.string().max(1000).trim().optional(),
  })
  .superRefine((w, ctx) => {
    // Skip validation for "none"
    if (w.type === "none") return;

    // Unit validation (required if type is not "none")
    if (!w.unit) {
      ctx.addIssue({
        path: ["unit"],
        message: "Unit is required",
        code: z.ZodIssueCode.custom,
      });
    }

    // Policy validation (optional but must be >= 10 if provided)
    if (w.policy && w.policy.length < 10) {
      ctx.addIssue({
        path: ["policy"],
        message: "Policy must be at least 10 characters",
        code: z.ZodIssueCode.custom,
      });
    }
  });

/* ---------------- Product Form Schema ---------------- */

export const GallerySchema = z.object({
  url: z.string().optional(), // Present for existing images
  fileId: z.string().optional(), // Present
  file: z.instanceof(File).optional(),
});
export const ProductSchema = z
  .object({
    _id: z.string().optional(),
    name: z.string().min(3, "Name must be at least 3 characters").max(60),
    price: z.coerce.number().min(1, "Price must be at least 1"),
    cost: z.coerce.number().min(1, "Cost cannot be negative").default(0),
    finalPrice: z.coerce.number().optional(),
    category: z.string().min(1, "Category is required").default("none"),
    subcategory: z.string().optional(),
    brand: z.string().max(50).optional(),

    gallery: z
      .array(GallerySchema)
      .min(1, "At least 1 image is required")
      .max(10, "Maximum 10 images"),
    shortDescription: z
      .string()
      .min(10, "Short description must be at least 10 characters")
      .max(200),
    description: z.string().max(1000).optional(),
    variants: z.array(VariantSchema).min(1, "At least one variant is required"),
    status: z.enum(["active", "inactive", "draft"]).default("draft"),
    isFeatured: z.boolean().default(false),
    warranty: WarrantySchema.default({ type: "none" }),
    discount: DiscountSchema.optional(),
    lastSoldAt: z.string().optional(),
    salesCount: z.number().optional(),

    ratingsCount: z.number().default(0),
    averageRating: z.number().default(0),

    shippingWeight: z.coerce
      .number()
      .min(0, "Weight cannot be negative")
      .optional(),
  })
  .superRefine((p, ctx) => {
    if (p.cost > p.price) {
      ctx.addIssue({
        path: ["cost"],
        message: "Cost cannot exceed selling price",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type ProductType = z.infer<typeof ProductSchema>;
export type VariantType = z.infer<typeof VariantSchema>;
