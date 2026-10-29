import { getR2PublicUrl } from "@/lib/r2";

// Anciens médias Cloudinary du site (aligné sur images.remotePatterns dans next.config.ts).
const CLOUDINARY_ORIGIN = "https://res.cloudinary.com";
const CLOUDINARY_PATH_PREFIX = "/wzetrnif/";

// Origine et préfixe de chemin des images R2, ou null si R2_PUBLIC_URL est absente :
// seules les URL Cloudinary sont alors acceptées.
function r2Target() {
  try {
    const base = new URL(getR2PublicUrl());
    if (base.protocol !== "https:") return null;
    return { origin: base.origin, pathPrefix: `${base.pathname.replace(/\/+$/, "")}/uploads/` };
  } catch {
    return null;
  }
}

// URL d'image acceptée en base : https, origine exactement égale à celle de R2
// (fichiers sous /uploads/) ou de Cloudinary pour les anciens médias.
export function isAllowedImageUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 1000) return false;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" || url.username || url.password) return false;

  const r2 = r2Target();
  if (r2 && url.origin === r2.origin && url.pathname.startsWith(r2.pathPrefix)) return true;

  return url.origin === CLOUDINARY_ORIGIN && url.pathname.startsWith(CLOUDINARY_PATH_PREFIX);
}
