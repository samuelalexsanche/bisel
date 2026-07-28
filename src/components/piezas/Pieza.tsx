import { cn } from "@/lib/cn";
import { FORMAS, type NombreForma } from "./formas";

/* 40 líneas de capa, las mismas 40 bandas que revela <PrintReveal>. Cuando la
   pieza se imprime al hacer scroll, cada escalón cae exactamente sobre una
   línea de capa: el efecto y el dibujo hablan del mismo objeto. */
const CAPAS = 40;
const ALTURA_CAPA = 200 / CAPAS;
const LINEAS = Array.from({ length: CAPAS }, (_, i) => i * ALTURA_CAPA);

type Props = {
  forma: NombreForma;
  className?: string;
  /** Dibuja la cama de impresión bajo la pieza. */
  conCama?: boolean;
  /** Sobre fondo Grafito se invierte el trazo. */
  invertido?: boolean;
  /**
   * `capas` — solo las líneas horizontales de capa.
   * `malla` — además el relleno interior en rejilla a 45° y los perímetros
   *           de pared. Es lo que hace que se lea "impresión 3D" de un vistazo.
   */
  relleno?: "capas" | "malla";
};

/**
 * Una pieza dibujada como plano técnico: perímetros, relleno y líneas de capa.
 * No es una foto y no pretende serlo (§13).
 *
 * Componente de servidor: es SVG en línea, no añade ni un byte al bundle ni una
 * petición de red, y <PrintReveal> puede imprimirlo sin JavaScript.
 */
export function Pieza({
  forma,
  className,
  conCama = false,
  invertido = false,
  relleno = "malla",
}: Props) {
  const f = FORMAS[forma];
  const trazo = invertido ? "var(--color-hueso)" : "var(--color-grafito)";
  const cuerpo = invertido
    ? "var(--color-texto-secundario)"
    : "var(--color-cemento)";
  const hueco = invertido ? "var(--color-grafito)" : "var(--color-hueso)";

  /* Los ids dependen solo de la forma y el tono: si la misma pieza sale dos
     veces en una página comparten definición, que es idéntica. */
  const sufijo = `${forma}${invertido ? "-inv" : ""}`;
  const idRecorte = `recorte-${sufijo}`;
  const idMalla = `malla-${sufijo}`;

  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label={f.alt}
      className={cn("h-auto w-full", className)}
    >
      <defs>
        <clipPath id={idRecorte}>
          <path d={f.d} />
        </clipPath>

        {/* Relleno en rejilla a 45°: el patrón que deja la boquilla al rellenar
            el interior de una pieza. */}
        <pattern
          id={idMalla}
          width="13"
          height="13"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2="13" stroke={hueco} strokeWidth="1.4" />
          <line x1="0" y1="0" x2="13" y2="0" stroke={hueco} strokeWidth="1.4" />
        </pattern>
      </defs>

      {conCama && (
        <g aria-hidden="true">
          {/* Cama de impresión: la línea sobre la que se apoya todo. */}
          <line
            x1="6"
            y1="150"
            x2="194"
            y2="150"
            stroke={trazo}
            strokeWidth="2"
          />
          {/* Marcas de la cama, como una regla. */}
          {Array.from({ length: 24 }, (_, i) => 6 + i * 8.2).map((x) => (
            <line
              key={x}
              x1={x}
              y1="150"
              x2={x}
              y2="156"
              stroke={cuerpo}
              strokeWidth="1"
            />
          ))}
        </g>
      )}

      {/* Cuerpo sólido */}
      <path d={f.d} fill={cuerpo} fillRule="evenodd" />

      <g clipPath={`url(#${idRecorte})`} aria-hidden="true">
        {relleno === "malla" && (
          <>
            {/* Relleno interior */}
            <rect width="200" height="200" fill={`url(#${idMalla})`} />

            {/* Perímetros de pared: un trazo grueso recortado a la silueta deja
                exactamente la banda maciza del borde que hace una impresora
                antes de empezar a rellenar. */}
            <path
              d={f.d}
              fill="none"
              stroke={cuerpo}
              strokeWidth="9"
              fillRule="evenodd"
            />
            <path
              d={f.d}
              fill="none"
              stroke={hueco}
              strokeWidth="1"
              opacity="0.6"
              transform="translate(0 3)"
              fillRule="evenodd"
            />
          </>
        )}

        {/* Líneas de capa */}
        {LINEAS.map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="200"
            y2={y}
            stroke={hueco}
            strokeWidth="1"
            opacity={relleno === "malla" ? 0.28 : 0.55}
          />
        ))}
      </g>

      {/* Detalles interiores: aristas que el contorno solo no cuenta */}
      {f.detalle && (
        <path
          d={f.detalle}
          fill="none"
          stroke={trazo}
          strokeWidth="1.25"
          opacity="0.55"
        />
      )}

      {/* Contorno */}
      <path
        d={f.d}
        fill="none"
        stroke={trazo}
        strokeWidth="2"
        strokeLinejoin="miter"
        fillRule="evenodd"
      />
    </svg>
  );
}
