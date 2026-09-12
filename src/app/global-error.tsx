"use client";

import { useEffect } from "react";

// Root layout crashed — this replaces the entire document, so it can't rely
// on globals.css classes or the design system being available; keep it
// dependency-free and inline-styled.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a1128",
          color: "#fefcfb",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
            Something went wrong
          </h1>
          <p style={{ color: "#9fb3c8", maxWidth: 400, margin: 0 }}>
            The site hit an unexpected error. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: 8,
              padding: "10px 20px",
              borderRadius: 8,
              border: "none",
              background: "#1282a2",
              color: "#fefcfb",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
