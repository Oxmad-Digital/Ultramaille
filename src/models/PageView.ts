import mongoose, { Schema, models, model } from "mongoose";

export interface IPageView {
  _id: mongoose.Types.ObjectId;
  day: string;
  path: string;
  referrer: string;
  deviceType: string;
  visitorHash: string;
  createdAt: Date;
}

const PageViewSchema = new Schema<IPageView>(
  {
    day: { type: String, required: true },
    path: { type: String, required: true },
    referrer: { type: String, default: "" },
    deviceType: { type: String, default: "desktop" },
    visitorHash: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

PageViewSchema.index({ day: 1 });
PageViewSchema.index({ day: 1, path: 1 });

export default models.PageView || model<IPageView>("PageView", PageViewSchema);
