import { Document, Types } from "mongoose";
import { Schema, model, models } from "mongoose";

export interface IAccount extends Document {
  _id: Types.ObjectId;
  accountId: string;
  providerId: string;
  userId: Types.ObjectId;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema = new Schema<IAccount>(
  {
    accountId: {
      type: String,
      required: true,
      index: true,
    },

    providerId: {
      type: String,
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Account =
  models.Account || model<IAccount>("Account", AccountSchema, "account");

export default Account;
