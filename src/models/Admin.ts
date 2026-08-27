import mongoose, { Schema, models, model } from "mongoose";

export type AdminRole = "admin" | "member";

export interface IAdmin {
  _id: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  role: AdminRole;
  resetTokenHash: string | null;
  resetTokenExpiry: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "member"], default: "admin" },
    resetTokenHash: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
  },
  { timestamps: true }
);

export default models.Admin || model<IAdmin>("Admin", AdminSchema);
