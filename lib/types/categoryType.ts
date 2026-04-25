import { z } from "zod";

export const categorySchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  subcategories: z.array(z.string()),
});

export type CategoryType = z.infer<typeof categorySchema>;
