"use server";

import { Schema, model, models } from "mongoose";

const CollectionSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],

      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],

      trim: true,
    },
    image: {
      url: {
        type: String,
        required: [true, "Image URL is required"],
      },
      fileId: String,
    },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  }
);

// Prevent model overwrite in dev/hot‑reload
const Collection = models.Collection || model("Collection", CollectionSchema);

export default Collection;
