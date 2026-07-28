import { ImageResponse } from "next/og";

import { BRAND } from "@/lib/brand";

export const alt = `${BRAND.name} · ${BRAND.descriptor}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* `output: export` exige declarar estática la generación de la imagen. */
export const dynamic = "force-static";

/**
 * Imagen de Open Graph — §8.1.
 *
 * Sin degradados, sin glow, esquinas rectas: los mismos tokens del §4. Las
 * líneas horizontales son el motivo de Strata.
 *
 * Se usa el sistema de fuentes del renderizador en lugar de cargar Space
 * Grotesk: no vale un viaje de red extra en cada generación, y el peso y el
 * tracking sostienen la identidad.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#F4F1EA",
        padding: 72,
      }}
    >
      {/* Estratos */}
      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} style={{ height: 1, backgroundColor: "#C9C5BC" }} />
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 2,
            color: "#4A4E50",
            textTransform: "uppercase",
          }}
        >
          {BRAND.city}, {BRAND.state}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 82,
            fontWeight: 700,
            letterSpacing: -2,
            color: "#1C1E1F",
            marginTop: 16,
          }}
        >
          La pieza que no existía.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#4A4E50",
            marginTop: 20,
          }}
        >
          {BRAND.descriptor}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            border: "3px solid #1C1E1F",
            padding: "10px 20px",
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: -1,
            color: "#1C1E1F",
          }}
        >
          {BRAND.nameUpper}
        </div>
        {/* Único elemento en Arcilla de la composición. */}
        <div
          style={{
            display: "flex",
            width: 120,
            height: 8,
            backgroundColor: "#C0492C",
          }}
        />
      </div>
    </div>,
    size,
  );
}
