import { connectDB } from "@/lib/db";
import Settings from "@/models/Settings";

export const SETTINGS_KEY = "site";

export async function getSiteSettings() {
  await connectDB();
  return Settings.findOneAndUpdate(
    { key: SETTINGS_KEY },
    { $setOnInsert: { key: SETTINGS_KEY } },
    { upsert: true, new: true }
  ).lean();
}
