import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const iconBuffer = readFileSync(
    join(process.cwd(), "public/brand/icon-512.png")
  );
  const iconSrc = `data:image/png;base64,${iconBuffer.toString("base64")}`;

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
        <img src={iconSrc} width={120} height={120} alt="" />
        <div
          style={{
            fontSize: 20,
            letterSpacing: 4,
            color: "#FF3B1F",
            fontWeight: 700,
            marginTop: 36,
            whiteSpace: "nowrap",
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
