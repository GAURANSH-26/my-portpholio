import mongoose, { Schema, type Model } from "mongoose";

export type AdminUserShape = {
  email: string;
  passwordHash: string;
  role: "owner";
};

const adminUserSchema = new Schema<AdminUserShape>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["owner"],
      default: "owner"
    }
  },
  { timestamps: true }
);

export const AdminUser =
  (mongoose.models.AdminUser as Model<AdminUserShape> | undefined) ??
  mongoose.model<AdminUserShape>("AdminUser", adminUserSchema);
