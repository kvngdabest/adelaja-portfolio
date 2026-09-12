import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a1128",
          border: "1px solid #034078",
          borderRadius: 7,
        }}
      >
        <span
          style={{
            color: "#fefcfb",
            fontSize: 20,
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
