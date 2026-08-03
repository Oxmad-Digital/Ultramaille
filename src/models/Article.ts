import mongoose, { Schema, models, model } from "mongoose";

export type ArticleStatus = "draft" | "scheduled" | "published";

export interface ILocalizedText {
  fr: string;
  en: string;
}

export interface IArticle {
  _id: mongoose.Types.ObjectId;
  title: ILocalizedText;
  slug: string;
  excerpt: ILocalizedText;
  content: ILocalizedText;
  coverImageUrl: string | null;
  coverImagePublicId: string | null;
  coverImageAlt: string;
  category: string;
  tags: string[];
  status: ArticleStatus;
  featured: boolean;
  publishedAt: Date | null;
  metaTitle: ILocalizedText;
  metaDescription: ILocalizedText;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const LocalizedTextSchema = new Schema<ILocalizedText>(
  {
    fr: { type: String, default: "" },
    en: { type: String, default: "" },
  },
  { _id: false }
);

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: LocalizedTextSchema, default: () => ({ fr: "", en: "" }) },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: LocalizedTextSchema, default: () => ({ fr: "", en: "" }) },
    content: { type: LocalizedTextSchema, default: () => ({ fr: "", en: "" }) },
    coverImageUrl: { type: String, default: null },
    coverImagePublicId: { type: String, default: null },
    coverImageAlt: { type: String, default: "" },
    category: { type: String, default: "", trim: true },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["draft", "scheduled", "published"], default: "draft" },
    featured: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
    metaTitle: { type: LocalizedTextSchema, default: () => ({ fr: "", en: "" }) },
    metaDescription: { type: LocalizedTextSchema, default: () => ({ fr: "", en: "" }) },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Article || model<IArticle>("Article", ArticleSchema);
