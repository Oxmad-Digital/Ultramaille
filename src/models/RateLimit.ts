import mongoose, { Schema, models, model } from "mongoose";

export interface IRateLimit {
  _id: mongoose.Types.ObjectId;
  key: string;
  count: number;
  expiresAt: Date;
}

const RateLimitSchema = new Schema<IRateLimit>({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
});

// MongoDB purge automatiquement les fenêtres expirées.
RateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default models.RateLimit || model<IRateLimit>("RateLimit", RateLimitSchema);
