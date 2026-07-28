"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useMotion } from "./useMotion";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * La firma del sitio — §5.3.
 *
 * El contenido se revela de abajo hacia arriba en 40 bandas discretas: se debe
 * ver el escalón de cada capa. Una línea de 2px en Grafito viaja pegada al
 * borde superior de lo ya impreso, como la boquilla, y desaparece al terminar.
 *
 * Donde hay soporte de `view-timeline`, la progresión va ligada al scroll y
 * este componente no necesita JS para animarse. El ref solo alimenta el
 * fallback compartido.
 */
export function PrintReveal({ children, className }: Props) {
  const ref = useMotion<HTMLDivElement>();

  return (
    <div ref={ref} className={cn("print", className)}>
      <div className="print__cuerpo">{children}</div>
      <div className="print__boquilla" aria-hidden="true" />
    </div>
  );
}
