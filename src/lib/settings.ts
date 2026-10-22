import { unstable_cache } from "next/cache";
import { settings } from "@/lib/repositories/settings";

export const SETTINGS_KEY = "site";
export const SETTINGS_CACHE_TAG = "site-settings";

async function readSiteSettings() {
  return settings.getOrCreate(SETTINGS_KEY);
}

// Cached because getSiteSettings() runs in the proxy on every public request
// (maintenance-mode check) — without this it was one DB round trip per page view.
export const getSiteSettings = unstable_cache(readSiteSettings, ["site-settings"], {
  tags: [SETTINGS_CACHE_TAG],
  revalidate: 60,
});
