import type { MetadataRoute } from "next";

/** Web app manifest — also the source of the icons Google uses in search. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Astralyn Group",
    short_name: "Astralyn",
    description:
      "Astralyn Group is a technology house. We architect businesses, engineer products and shape the future — through strategy, design and technology.",
    start_url: "/",
    display: "standalone",
    background_color: "#080808",
    theme_color: "#080808",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
