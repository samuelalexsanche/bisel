import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  /**
   * Plano de profundidad — §5.2.
   *   0 · Estratos   0.15x
   *   1 · Superficie 0.40x
   *   3 · Cotas      1.12x  ← va MÁS RÁPIDO que el contenido: es lo que produce
   *                           la sensación de acetato por delante del objeto.
   * El plano 2 (contenido, 1.00x) no se envuelve: es el flujo normal.
   */
  depth: 0 | 1 | 3;
  children: ReactNode;
  className?: string;
};

/**
 * Aplica la velocidad del plano correspondiente. Solo `transform: translate3d()`.
 *
 * Componente de servidor: todo el movimiento vive en CSS scroll-driven, sin JS.
 * Los planos 0 y 1 se congelan por debajo de 768px (§5.4.6).
 */
export function ParallaxLayer({ depth, children, className }: Props) {
  return (
    <div
      data-depth={depth}
      className={cn("par", className)}
      // Los planos 0 y 1 son textura y fondo: no aportan nada a un lector de pantalla.
      aria-hidden={depth === 0 || depth === 1 ? true : undefined}
    >
      {children}
    </div>
  );
}
