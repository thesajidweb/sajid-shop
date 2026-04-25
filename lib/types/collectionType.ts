import { z } from "zod";

export const CollectionSchema = z
  .object({
    _id: z.string().optional(),
    title: z
      .string()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title must not exceed 60 characters")
      .trim(),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(200, "Description must not exceed 100 characters")
      .trim(),
    image: z.object({
      url: z.string().min(1, "Image is required"),
      fileId: z.string().optional(),
    }),
    products: z.array(z.string()).optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .refine(
    (data) => {
      // Custom validation: Allow temporary/preview URLs if url starts with blob:
      if (data.image.url.startsWith("blob:")) {
        return true;
      }
      // Check if the image URL is valid
      return z.string().url().safeParse(data.image.url).success;
    },
    {
      message: "Image URL must be valid",
      path: ["image", "url"],
    },
  );
export type CollectionType = z.infer<typeof CollectionSchema>;
