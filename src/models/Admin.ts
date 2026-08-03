import mongoose, { Schema, models, model } from "mongoose";

export interface IAdmin {
  _id: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  resetTokenHash: string | null;
  resetTokenExpiry: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    resetTokenHash: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
  },
  { timestamps: true }
);

export default models.Admin || model<IAdmin>("Admin", AdminSchema);
