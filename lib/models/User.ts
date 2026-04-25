import { Document, Types, Schema, model, models } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  emailVerified: boolean;
  role: "customer" | "admin" | "manager" | "order-manager";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    emailVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["customer", "admin", "manager", "order-manager"],
      default: "customer",
    },
  },
  { timestamps: true },
);

const User = models.User || model<IUser>("User", UserSchema, "user");
export default User;
