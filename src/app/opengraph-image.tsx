import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "TubeForgeStudio — YouTube automation studio";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#090909",
          color: "#F5F5F5",
          padding: "64px",
        }}
      >
        <div style={{ display: "flex", color: "#FF6B24", letterSpacing: "0.18em", fontSize: 22 }}>TUBEFORGESTUDIO</div>
        <div style={{ display: "flex", fontSize: 64, lineHeight: 0.95, fontWeight: 700, maxWidth: 920 }}>
          WE BUILD YOUTUBE CHANNELS THAT KEEP PEOPLE WATCHING.
        </div>
        <div style={{ display: "flex", color: "#A1A1AA", fontSize: 24 }}>Research, scripts, edits, thumbnails, and channel systems.</div>
      </div>
    ),
    size,
  );
}
