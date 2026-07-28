import { cn } from "@/lib/cn";

/* Macro de la textura de capa — §5.5.
   "Enseñar las capas genera confianza, esconderlas la destruye."
   Las capas de una impresión real no son perfectamente regulares: el grosor
   varía un poco. Esa irregularidad es justo lo que la hace creíble como macro
   y no como patrón de software. */
const CAPAS = [
  2.4, 3.1, 2.7, 3.4, 2.9, 2.5, 3.2, 2.8, 3.5, 2.6, 3.0, 2.4, 3.3, 2.7, 3.1,
  2.9, 2.5, 3.4, 2.8, 3.2, 2.6, 3.0, 2.7, 3.3, 2.4, 3.1, 2.9, 2.6, 3.4, 2.8,
];

/* Las alturas son constantes, así que las posiciones se calculan una sola vez
   al cargar el módulo y no en cada render. */
const FILAS = CAPAS.reduce<{ y: number; alto: number; i: number }[]>(
  (acc, alto, i) => [
    ...acc,
    {
      y:
        acc.length === 0 ? 0 : acc[acc.length - 1].y + acc[acc.length - 1].alto,
      alto,
      i,
    },
  ],
  [],
);
const ALTO_TOTAL = CAPAS.reduce((s, a) => s + a, 0);

export function TexturaCapas({
  className,
  invertido = false,
}: {
  className?: string;
  invertido?: boolean;
}) {
  const fondo = invertido ? "var(--color-grafito)" : "var(--color-cemento)";
  const linea = invertido
    ? "var(--color-cemento)"
    : "var(--color-texto-secundario)";

  const filas = FILAS;
  const total = ALTO_TOTAL;

  return (
    <svg
      viewBox={`0 0 100 ${total}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("h-full w-full", className)}
    >
      <rect width="100" height={total} fill={fondo} />
      {filas.map(({ y: fy, alto, i }) => (
        <g key={i}>
          {/* Cada capa deja una sombra fina en su unión con la siguiente. */}
          <line
            x1="0"
            y1={fy + alto}
            x2="100"
            y2={fy + alto}
            stroke={linea}
            strokeWidth="0.55"
            opacity="0.85"
          />
          {/* Y un brillo tenue arriba, donde la boquilla aplastó el material. */}
          <line
            x1="0"
            y1={fy + 0.5}
            x2="100"
            y2={fy + 0.5}
            stroke={
              invertido ? "var(--color-texto-secundario)" : "var(--color-hueso)"
            }
            strokeWidth="0.4"
            opacity="0.5"
          />
        </g>
      ))}
    </svg>
  );
}
