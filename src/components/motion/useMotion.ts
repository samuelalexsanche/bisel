"use client";

import { useEffect, useRef, type RefObject } from "react";

/* ============================================================================
   IntersectionObserver ÚNICO y COMPARTIDO — §5.4.3

   El spec es explícito: el fallback NO es un listener de `scroll`, y NUNCA un
   IntersectionObserver por componente. Este módulo mantiene una sola instancia
   para todo el sitio; cada primitiva se limita a registrar su nodo.
   ========================================================================= */

let io: IntersectionObserver | null = null;

function obtenerObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;

  io ??= new IntersectionObserver(
    (entradas, self) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        entrada.target.classList.add("is-in");
        // Entrada de una sola vez: nada re-anima al volver a subir.
        self.unobserve(entrada.target);
      }
    },
    // Dispara cuando el bloque ya entró de verdad, no al asomar 1px.
    { rootMargin: "0px 0px -12% 0px", threshold: 0 },
  );

  return io;
}

/**
 * Registra un elemento en el observer compartido y devuelve su ref.
 *
 * Si el navegador no trae IntersectionObserver, el elemento pasa directo al
 * estado final: es preferible el contenido visible sin animar a un bloque
 * invisible para siempre.
 */
export function useMotion<
  T extends HTMLElement = HTMLDivElement,
>(): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = obtenerObserver();
    if (!observer) {
      el.classList.add("is-in");
      return;
    }

    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

  return ref;
}
