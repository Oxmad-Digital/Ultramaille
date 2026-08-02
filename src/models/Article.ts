import mongoose, { Schema, models, model } from "mongoose";

export interface IArticle {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  coverImagePublicId: string | null;
  status: "draft" | "published";
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: String, default: "", trim: true },
    content: { type: String, required: true },
    coverImageUrl: { type: String, default: null },
    coverImagePublicId: { type: String, default: null },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default models.Article || model<IArticle>("Article", ArticleSchema);
