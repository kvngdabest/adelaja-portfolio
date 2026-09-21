import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Adelaja Obanijesu Israel — Front-End Developer & AI Content Creator",
    short_name: "Adelaja",
    description:
      "Front-end developer creating fast websites, AI video content, and sales automation for product brands.",
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
