// Compte Cloudinary du site (aligné sur images.remotePatterns dans next.config.ts).
const CLOUD_HOST = "res.cloudinary.com";
const CLOUD_PATH_PREFIX = "/wzetrnif/";

export function isCloudinaryUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 1000) return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === CLOUD_HOST &&
      url.pathname.startsWith(CLOUD_PATH_PREFIX)
    );
  } catch {
    return false;
  }
}
