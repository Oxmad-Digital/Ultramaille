export const SITE_URL = "https://www.ultramaille.com";

export const CONTACT = {
  streetAddress: "Lot II G 55 ter NBA Ambatomaro, BP 3298",
  addressLocality: "Antananarivo",
  postalCode: "101",
  addressCountry: "MG",
  telephone: "+261341185522",
  telephoneDisplay: "+261 34 11 855 22",
  email: "contact@ultramaille.com",
};

// Pages publiques statiques (hors /blog/[slug]). Sert à n'enregistrer que des chemins
// réels dans les stats. À garder alignée avec src/app/sitemap.ts.
export const PUBLIC_PATHS = [
  "/",
  "/a-propos",
  "/notre-expertise",
  "/notre-engagement",
  "/blog",
  "/contact",
  "/mentions-legales",
];

export function isTrackablePath(path: string) {
  return PUBLIC_PATHS.includes(path) || /^\/blog\/[a-z0-9-]{1,200}$/.test(path);
}
