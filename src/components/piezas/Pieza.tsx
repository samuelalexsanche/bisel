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
};

/**
 * Una pieza dibujada como plano técnico: contorno firme y relleno de líneas de
 * capa. No es una foto y no pretende serlo (§13).
 *
 * Componente de servidor: es SVG en línea, no añade ni un byte al bundle ni una
 * petición de red, y <PrintReveal> puede imprimirlo sin JavaScript.
 */
export function Pieza({
  forma,
  className,
  conCama = false,
  invertido = false,
}: Props) {
  const f = FORMAS[forma];
  const trazo = invertido ? "var(--color-hueso)" : "var(--color-grafito)";
  const relleno = invertido
    ? "var(--color-texto-secundario)"
    : "var(--color-cemento)";
  const hueco = invertido ? "var(--color-grafito)" : "var(--color-hueso)";

  /* El id depende solo de la forma: si la misma pieza sale dos veces en una
     página comparten recorte, que es idéntico. */
  const idRecorte = `capas-${forma}`;

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
      </defs>

      {conCama && (
        <g aria-hidden="true">
          {/* Cama de impresión: la línea sobre la que se apoya todo. */}
          <line
            x1="8"
            y1="150"
            x2="192"
            y2="150"
            stroke={trazo}
            strokeWidth="2"
          />
          {/* Marcas de la cama, como una regla. */}
          {Array.from({ length: 24 }, (_, i) => 8 + i * 8).map((x) => (
            <line
              key={x}
              x1={x}
              y1="150"
              x2={x}
              y2="156"
              stroke={relleno}
              strokeWidth="1"
            />
          ))}
        </g>
      )}

      {/* Cuerpo de la pieza */}
      <path d={f.d} fill={relleno} fillRule="evenodd" />

      {/* Líneas de capa, recortadas a la silueta */}
      <g clipPath={`url(#${idRecorte})`} aria-hidden="true">
        {LINEAS.map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="200"
            y2={y}
            stroke={hueco}
            strokeWidth="1"
            opacity="0.55"
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
