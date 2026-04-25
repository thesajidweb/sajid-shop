import { Document, Types } from "mongoose";
import { Schema, model, models } from "mongoose";

export interface IVerification extends Document {
  _id: Types.ObjectId;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationSchema = new Schema(
  {
    identifier: {
      type: String,
      required: true,
      index: true,
    },

    value: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

VerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Verification =
  models.Verification || model("Verification", VerificationSchema);

export default Verification;
