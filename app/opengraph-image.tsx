import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0A0A0B",
          color: "#F5F5F2",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: 8,
            color: "#FF3B1F",
            fontWeight: 700,
          }}
        >
          CINEMATIC FILM / ATHLETE BRANDING / SOCIAL CONTENT
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 96,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
            marginTop: 28,
          }}
        >
          <span>SPORTS</span>
          <span>DESIGN</span>
          <span>JAPAN</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
