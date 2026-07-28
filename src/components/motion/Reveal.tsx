"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useMotion } from "./useMotion";

type Props = {
  children: ReactNode;
  className?: string;
  /** Escalonado para listas y rejillas. 60ms por paso. */
  delay?: 1 | 2 | 3;
};

/**
 * Entrada estándar de bloques de contenido — §5.3.
 * opacity 0→1 y translateY 16px→0. Sin escala, sin rotación, sin rebote.
 *
 * No usar sobre el fold: el estado inicial es opacity:0 y retrasaría el LCP
 * hasta que hidrate el JS. El héroe se mueve con <PrintReveal>, que es CSS puro.
 */
export function Reveal({ children, className, delay }: Props) {
  const ref = useMotion<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "reveal",
        delay ? `reveal-d${delay}` : undefined,
        className,
      )}
    >
      {children}
    </div>
  );
}
