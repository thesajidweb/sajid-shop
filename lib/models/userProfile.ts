import mongoose, { Schema, Document, Model } from "mongoose";

const addressSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    fullName: { type: String, required: true },

    phone: { type: String },
    address: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    zipCode: { type: String },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }, // separate ID for each address
);

const wishlistItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product", // reference to your Product model
    index: true,
  },
});

export interface IUserProfile extends Document {
  userId: mongoose.Types.ObjectId;

  addresses: (typeof addressSchema)[];
  wishlistItems: (typeof wishlistItemSchema)[];
  createdAt: Date;
  updatedAt: Date;
}

const userProfileSchema = new Schema<IUserProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user", // BetterAuth user
      required: true,
      unique: true,
      index: true,
    },

    // Embedded array of addresses
    addresses: [addressSchema],

    // Wishlist array referencing Product
    wishlistItems: [wishlistItemSchema],
  },
  {
    timestamps: true,
  },
);

export const UserProfile: Model<IUserProfile> =
  mongoose.models.UserProfile ||
  mongoose.model<IUserProfile>("UserProfile", userProfileSchema);
