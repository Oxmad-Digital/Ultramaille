import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ultramaille — Une maille d'exception, façonnée à Madagascar",
    short_name: "Ultramaille",
    description:
      "Spécialistes de la maille à Antananarivo, Madagascar. Tricot, crochet et broderie pour les plus grandes maisons de mode.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf8f2",
    theme_color: "#0f1e30",
    icons: [
      {
        src: "/icon.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
