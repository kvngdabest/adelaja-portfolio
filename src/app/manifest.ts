import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_ROLE } from "@/lib/content/positioning";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `Adelaja Obanijesu Israel — ${SITE_ROLE}`,
    short_name: "Adelaja",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#0a1128",
    theme_color: "#0a1128",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
