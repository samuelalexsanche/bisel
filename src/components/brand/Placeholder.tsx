import { cn } from "@/lib/cn";
import { Pieza } from "@/components/piezas/Pieza";
import type { NombreForma } from "@/components/piezas/formas";

type Props = {
  /** Qué falta, en texto legible. Nunca "lorem ipsum", nunca foto de stock. */
  etiqueta: string;
  /** Relación de aspecto real del activo que va a ocupar este hueco. */
  ratio?: string;
  /** Dibujo técnico de fondo, para que el hueco no sea un rectángulo vacío. */
  forma?: NombreForma;
  className?: string;
};

/**
 * Placeholder declarado — §14.
 *
 * Mientras no existan las fotos reales, el desarrollo procede con bloques que
 * tienen la relación de aspecto correcta y una etiqueta visible de qué falta.
 * Nunca fotos de stock, nunca texto de relleno en latín.
 *
 * Va con marcas de encuadre de plano técnico en lugar de ser un rectángulo
 * gris: comunica lo mismo — "aquí falta una foto" — pero pertenece al mismo
 * lenguaje visual que el resto del sitio.
 */
export function Placeholder({
  etiqueta,
  ratio = "4 / 3",
  forma,
  className,
}: Props) {
  return (
    <div
      role="img"
      aria-label={`Pendiente: ${etiqueta}`}
      style={{ aspectRatio: ratio }}
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden border border-texto-secundario bg-cemento",
        className,
      )}
    >
      {/* Dibujo técnico de la pieza que irá aquí. */}
      {forma && (
        <div className="absolute inset-0 flex items-center justify-center p-[12%] opacity-40">
          <Pieza forma={forma} />
        </div>
      )}

      {/* Marcas de encuadre, como un plano sin acotar. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {[
          "M0 8 L0 0 L8 0",
          "M92 0 L100 0 L100 8",
          "M100 92 L100 100 L92 100",
          "M8 100 L0 100 L0 92",
        ].map((d) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke="var(--color-grafito)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      <span className="cifra relative z-10 mx-4 border border-texto-secundario bg-hueso px-3 py-2 text-center text-detalle text-grafito">
        {etiqueta}
      </span>
    </div>
  );
}
