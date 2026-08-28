import { connectDB } from "@/lib/db";
import Article from "@/models/Article";

const THROTTLE_MS = 60_000;

declare global {
  var _lastPublishDueArticlesRun: number | undefined;
}

// Scheduled articles have no independent cron: their status flips to
// "published" lazily, the first time this runs after publishedAt passes.
// Throttled to once per THROTTLE_MS since it was otherwise issuing a write
// query on every single blog page/article request.
export async function publishDueArticles() {
  const now = Date.now();
  if (global._lastPublishDueArticlesRun && now - global._lastPublishDueArticlesRun < THROTTLE_MS) {
    return;
  }
  global._lastPublishDueArticlesRun = now;

  await connectDB();
  await Article.updateMany(
    { status: "scheduled", publishedAt: { $lte: new Date() } },
    { $set: { status: "published" } }
  );
}
