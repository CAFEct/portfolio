import { ImageResponse } from "next/og";

export const alt = "Gabriel | CAFÉ — Portfólio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
          background: "linear-gradient(135deg, #02152e 0%, #0b63ff 55%, #22e5ff 130%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 140, fontWeight: 800, letterSpacing: -4 }}>CAFÉ</div>
        <div style={{ fontSize: 44, marginTop: 16, opacity: 0.9 }}>
          Gabriel — dev, UI/UX e criador de conteúdo
        </div>
        <div style={{ marginTop: 40, fontSize: 28, color: "#7cc8ff" }}>
          portfólio · projetos · certificados
        </div>
      </div>
    ),
    size,
  );
}
