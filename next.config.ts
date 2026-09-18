import type { NextConfig } from "next";

// Anciennes URLs du site WordPress (FR + EN) -> pages équivalentes du nouveau site.
// `/:path*` couvre aussi la racine de la section (ex. /visite-dusine et /visite-dusine/pressing).
// Les pages WordPress techniques (connexion, inscription, tests, /documents) ne sont
// volontairement pas redirigées : elles restent en 404.
const LEGACY_REDIRECTS: Record<string, string[]> = {
  "/": [
    "/welcome-to-the-ultramaille-site",
    "/ultramaille-madagascar-usine",
    "/ultramaille-s-a-usine-textile-de-pull-overs",
    "/plan-du-site",
    "/sitemap",
  ],
  "/a-propos#equipe": ["/equipe/:path*"],
  "/a-propos": ["/zones/:path*"],
  "/notre-expertise": [
    "/savoir-faire",
    "/show-room",
    "/visite-dusine/:path*",
    "/factory-visit/:path*",
    "/expertise-usine-ultramaille/:path*",
    "/pull-over-ultramaille/:path*",
    "/ultramaille-s-a-pull-over/:path*",
    "/proposition-fils-mailles/:path*",
    "/our-range/:path*",
    "/classeur/:path*",
  ],
  "/notre-engagement": [
    "/durabilite/:path*",
    "/protection-environnement",
    "/sante-condition-de-travail",
    "/health-and-working-conditions",
    "/les-representants-du-personnel",
    "/staff-representatives",
    "/plan-de-formation",
    "/training-plan",
    "/social-et-art",
    "/social-and-art",
    "/social-art-ultramaille",
  ],
  "/blog": ["/actualites/:path*"],
  "/contact": ["/nos-emplacements"],
  "/mentions-legales": ["/legal-notice"],
  // Sitemaps Yoast : le nouveau site n'expose que /sitemap.xml
  "/sitemap.xml": [
    "/sitemap_index.xml",
    ...[
      "page",
      "zones",
      "equipe",
      "classeur",
      "type-zone",
      "categorie-de-l-equipe",
      "categorie-de-classeur",
    ].map((name) => `/${name}-sitemap.xml`),
  ],
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/wzetrnif/**",
      },
    ],
  },
  async redirects() {
    return Object.entries(LEGACY_REDIRECTS).flatMap(([destination, sources]) =>
      sources.map((source) => ({ source, destination, permanent: true }))
    );
  },
};

export default nextConfig;
