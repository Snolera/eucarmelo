import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Imagem do link compartilhado (WhatsApp, LinkedIn, X): gerada no build e cacheada
export const alt = "Welinton Carmelo, videomaker: reels e vídeos para marcas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Mesmas cores do globals.css (o ImageResponse não lê variáveis CSS)
const BG = "#151717";
const ACCENT = "#e1ad66";

// Retrato do Sobre (1280×720) lido uma vez no módulo, em base64: o Satori só aceita URL ou data URL
const portrait = await readFile(join(process.cwd(), "sections/About/media/sobre.jpeg"));
const src = `data:image/jpeg;base64,${portrait.toString("base64")}`;

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: BG, position: "relative" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori não usa next/image */}
        <img src={src} alt="" width={1200} height={630} style={{ position: "absolute", left: 0, top: 0, objectFit: "cover" }} />
        {/* Escurece à esquerda para o texto ter contraste */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            background: `linear-gradient(90deg, rgba(21,23,23,0.95) 0%, rgba(21,23,23,0.85) 30%, rgba(21,23,23,0.2) 55%, rgba(21,23,23,0) 70%)`,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "64px 72px", color: "#fff", position: "relative" }}>
          <div style={{ fontSize: 30, letterSpacing: 6, color: ACCENT, textTransform: "uppercase" }}>@eucarmelo</div>
          <div style={{ fontSize: 84, lineHeight: 1, marginTop: 16 }}>Welinton</div>
          <div style={{ fontSize: 84, lineHeight: 1 }}>Carmelo</div>
          <div style={{ fontSize: 32, marginTop: 28, color: "rgba(255,255,255,0.8)" }}>Videomaker · Reels para marcas</div>
        </div>
      </div>
    ),
    size
  );
}
