import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Adelaja Obanijesu Israel — AI Automation & Full-Stack Developer",
    short_name: "Adelaja",
    description:
      "AI Automation Engineer building n8n workflows, AI agents, and full-stack products.",
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
