import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db";
import Settings from "@/models/Settings";

export const SETTINGS_KEY = "site";
export const SETTINGS_CACHE_TAG = "site-settings";

async function readSiteSettings() {
  await connectDB();
  return Settings.findOneAndUpdate(
    { key: SETTINGS_KEY },
    { $setOnInsert: { key: SETTINGS_KEY } },
    { upsert: true, returnDocument: "after" }
  ).lean();
}

// Cached because getSiteSettings() runs in the proxy on every public request
// (maintenance-mode check) — without this it was one DB round trip per page view.
export const getSiteSettings = unstable_cache(readSiteSettings, ["site-settings"], {
  tags: [SETTINGS_CACHE_TAG],
  revalidate: 60,
});
