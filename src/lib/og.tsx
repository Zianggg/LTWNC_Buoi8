import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 };

// Satori (ImageResponse) cần font có glyph tiếng Việt; ghép 2 subset latin + vietnamese.
const FONT_DIR = path.join(process.cwd(), "node_modules/@fontsource/be-vietnam-pro/files");

async function loadFonts() {
  const files = [
    ["latin", 400],
    ["vietnamese", 400],
    ["latin", 700],
    ["vietnamese", 700],
  ] as const;
  return Promise.all(
    files.map(async ([subset, weight]) => ({
      name: "Be Vietnam Pro",
      data: await readFile(path.join(FONT_DIR, `be-vietnam-pro-${subset}-${weight}-normal.woff`)),
      weight,
      style: "normal" as const,
    })),
  );
}

type OgCard = { eyebrow: string; title: string; subtitle: string; badge?: string };

export async function renderOgCard({ eyebrow, title, subtitle, badge }: OgCard): Promise<ImageResponse> {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #1c1917 0%, #431407 100%)",
          color: "#fafaf9",
          fontFamily: "Be Vietnam Pro",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#fdba74", fontWeight: 700 }}>{eyebrow}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
          <div style={{ display: "flex", fontSize: 32, color: "#d6d3d1" }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 28 }}>
          <div style={{ display: "flex" }}>{SITE.name}</div>
          {badge ? (
            <div
              style={{
                display: "flex",
                background: "#ea580c",
                color: "#fff",
                padding: "12px 28px",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 36,
              }}
            >
              {badge}
            </div>
          ) : null}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await loadFonts() },
  );
}
