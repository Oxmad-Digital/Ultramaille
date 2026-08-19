import mongoose, { Schema, models, model } from "mongoose";

export interface IAuthor {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  email: string;
  bio: string;
  avatarUrl: string | null;
  avatarPublicId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const AuthorSchema = new Schema<IAuthor>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    email: { type: String, default: "", trim: true },
    bio: { type: String, default: "" },
    avatarUrl: { type: String, default: null },
    avatarPublicId: { type: String, default: null },
  },
  { timestamps: true }
);

export default models.Author || model<IAuthor>("Author", AuthorSchema);
