import mongoose, { Schema, models, model } from "mongoose";

export interface IMedia {
  _id: mongoose.Types.ObjectId;
  url: string;
  publicId: string;
  filename: string;
  alt: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true, unique: true },
    filename: { type: String, default: "" },
    alt: { type: String, default: "" },
    format: { type: String, default: "" },
    bytes: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Media || model<IMedia>("Media", MediaSchema);
