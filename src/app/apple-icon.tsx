import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 30% 20%, #034078 0%, #0a1128 70%)",
        }}
      >
        <span
          style={{
            color: "#fefcfb",
            fontSize: 92,
            fontWeight: 700,
            fontFamily: "sans-serif",
          }}
        >
          A<span style={{ color: "#1282a2" }}>.</span>
        </span>
      </div>
    ),
    { ...size }
  );
}
