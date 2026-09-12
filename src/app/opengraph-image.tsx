import { ImageResponse } from "next/og";

export const alt =
  "Adelaja Obanijesu Israel — AI Automation & Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(ellipse 60% 50% at 20% 0%, rgba(18,130,162,0.35), transparent 60%), radial-gradient(ellipse 50% 40% at 90% 100%, rgba(3,64,120,0.45), transparent 60%), #0a1128",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#1282a2",
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: 28,
          }}
        >
          AI Automation &amp; Full-Stack Developer
        </div>
        <div
          style={{
            display: "flex",
            color: "#fefcfb",
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: -1,
          }}
        >
          Adelaja Obanijesu Israel
        </div>
        <div
          style={{
            display: "flex",
            color: "#9fb3c8",
            fontSize: 32,
            marginTop: 28,
            maxWidth: 920,
          }}
        >
          n8n workflows · AI agent pipelines · React/Next.js · Python · Django
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 56,
            left: 80,
            color: "#5a6b8c",
            fontSize: 24,
          }}
        >
          Lagos, Nigeria
        </div>
      </div>
    ),
    { ...size }
  );
}
