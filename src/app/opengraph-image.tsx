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
          padding: "80px",
          background: "#0f1e30",
          backgroundImage:
            "linear-gradient(135deg, #0f1e30 0%, #15263b 60%, #0c121c 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "sans-serif",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#e0a338",
            marginBottom: 28,
          }}
        >
          Antananarivo — Madagascar
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "sans-serif",
            fontWeight: 700,
            fontSize: 108,
            color: "#fbf8f2",
            letterSpacing: -2,
          }}
        >
          Ultramaille
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "sans-serif",
            fontSize: 34,
            color: "rgba(251,248,242,0.75)",
            marginTop: 20,
          }}
        >
          Une maille d&apos;exception, façonnée à Madagascar.
        </div>
      </div>
    ),
    { ...size }
  );
}
