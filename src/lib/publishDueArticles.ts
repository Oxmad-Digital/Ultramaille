import { connectDB } from "@/lib/db";
import Article from "@/models/Article";

// Scheduled articles have no independent cron: their status flips to
// "published" lazily, the first time this runs after publishedAt passes.
export async function publishDueArticles() {
  await connectDB();
  await Article.updateMany(
    { status: "scheduled", publishedAt: { $lte: new Date() } },
    { $set: { status: "published" } }
  );
}
