import { cn } from "@/lib/cn";

/* Serpentina: el recorrido que hace la boquilla al rellenar una capa, de ida y
   vuelta con giro en los extremos. Se genera en vez de escribirse a mano para
   poder cambiar el número de pasadas sin redibujar nada. */
function serpentina(pasadas: number, ancho: number, paso: number): string {
  const m = 6;
  const partes: string[] = [`M${m} ${m}`];
  for (let i = 0; i < pasadas; i++) {
    const y = m + i * paso;
    const derecha = i % 2 === 0;
    partes.push(`L${derecha ? ancho - m : m} ${y}`);
    if (i < pasadas - 1) {
      // giro en el extremo, del radio de media pasada
      const r = paso / 2;
      partes.push(
        `A${r} ${r} 0 0 ${derecha ? 1 : 0} ${derecha ? ancho - m : m} ${y + paso}`,
      );
    }
  }
  return partes.join(" ");
}

const ANCHO = 1200;
const PASO = 13;
const PASADAS = 5;

type Props = {
  className?: string;
  /** Sobre Grafito el trazo se invierte a Cemento. */
  oscuro?: boolean;
};

/**
 * Trayectoria de la boquilla — separador entre secciones.
 *
 * Es un gráfico del proceso, no de la máquina: §13 prohíbe dibujar impresoras
 * como ícono, pero el rastro que deja la boquilla es justo lo que este taller
 * vende. Decorativo, así que va con `aria-hidden`.
 */
export function Trayectoria({ className, oscuro = false }: Props) {
  const alto = 6 * 2 + (PASADAS - 1) * PASO;

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${ANCHO} ${alto}`}
      preserveAspectRatio="none"
      className={cn("h-12 w-full", className)}
    >
      <path
        d={serpentina(PASADAS, ANCHO, PASO)}
        fill="none"
        stroke={
          oscuro ? "var(--color-cemento)" : "var(--color-texto-secundario)"
        }
        strokeWidth="1.5"
        strokeLinecap="square"
        opacity="0.55"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
