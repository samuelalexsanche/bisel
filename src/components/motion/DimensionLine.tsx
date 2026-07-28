"use client";

import { cn } from "@/lib/cn";
import { useMotion } from "./useMotion";

type Props = {
  /** La medida real, con unidad. Ej. "18.4 cm". */
  medida: string;
  orientacion?: "horizontal" | "vertical";
  className?: string;
};

/**
 * Cotas estilo plano técnico — §5.3.
 *
 * Se usa SOBRE fotos de producto para mostrar medidas reales, nunca como
 * adorno: una pieza flotando sin referencia de tamaño genera devoluciones (§7.1).
 *
 * §5.3 sugiere stroke-dasharray/stroke-dashoffset, pero §5.4 regla 4 prohíbe
 * animar nada que no sea transform u opacity y está marcada como no negociable.
 * Para una línea recta, scaleX() desde el extremo es visualmente idéntico al
 * trazo por dashoffset, así que se dibuja con transform.
 */
export function DimensionLine({
  medida,
  orientacion = "horizontal",
  className,
}: Props) {
  const ref = useMotion<HTMLDivElement>();
  const esVertical = orientacion === "vertical";

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`Medida: ${medida}`}
      className={cn(
        "cota relative flex items-center justify-center",
        esVertical ? "cota--v h-full w-6 flex-col" : "h-6 w-full",
        className,
      )}
    >
      {/* Tope inicial */}
      <span
        aria-hidden="true"
        className={cn(
          "cota__tope shrink-0 bg-grafito",
          esVertical ? "h-px w-3" : "h-3 w-px",
        )}
      />

      {/* Línea que se dibuja sola */}
      <span
        aria-hidden="true"
        className={cn("relative flex-1", esVertical ? "w-px" : "h-px")}
      >
        <span className="cota__linea absolute inset-0 block bg-grafito" />
      </span>

      {/* Tope final */}
      <span
        aria-hidden="true"
        className={cn(
          "cota__tope shrink-0 bg-grafito",
          esVertical ? "h-px w-3" : "h-3 w-px",
        )}
      />

      {/* La cifra se apoya sobre la línea con un respaldo en Hueso para que la
          línea no la atraviese. Grafito sobre Hueso = 14.84:1. */}
      <span
        aria-hidden="true"
        className="cota__cifra cifra absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-hueso px-2 text-detalle text-grafito"
      >
        {medida}
      </span>
    </div>
  );
}
