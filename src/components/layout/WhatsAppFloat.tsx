"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { BRAND, waLink } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { TRAZO } from "@/lib/iconos";
import { trackContact } from "@/lib/pixel";

/**
 * Mensaje contextual del botón flotante — §7.3.
 *
 * La calculadora publica el presupuesto actual en `window.__biselWaMensaje` y
 * avisa con `bisel:wa-mensaje`. Aquí se lee como store externo: useSyncExternalStore
 * garantiza que tras suscribirse se re-compara el snapshot y se re-renderiza si
 * cambió, así el flotante nunca se queda con el mensaje genérico aunque el
 * evento llegue antes de su suscripción (orden de montaje).
 */
const WA_MENSAJE_EVENTO = "bisel:wa-mensaje";

function suscribirseAlMensaje(cb: () => void) {
  window.addEventListener(WA_MENSAJE_EVENTO, cb);
  return () => window.removeEventListener(WA_MENSAJE_EVENTO, cb);
}

function leerMensajeActual(): string | null {
  return (
    (window as Window & { __biselWaMensaje?: string }).__biselWaMensaje ?? null
  );
}

/**
 * Botón flotante de WhatsApp — §7.0.
 *
 * Aquí se resuelve en código el único conflicto estructural del sistema: el
 * flotante es persistente y va en Arcilla, así que consumiría el acento en
 * todas las vistas. La regla es que este botón es el elemento Arcilla por
 * defecto y se OCULTA mientras una sección con su propio acento esté en
 * viewport. Nunca dos elementos Arcilla en pantalla a la vez (§4.1 regla 1).
 *
 * Las secciones acentuadas se marcan con `data-acento="arcilla"`.
 */
export function WhatsAppFloat() {
  const [oculto, setOculto] = useState(false);
  const mensaje = useSyncExternalStore(
    suscribirseAlMensaje,
    leerMensajeActual,
    () => null, // snapshot de servidor: sin window, sin mensaje contextual
  );

  useEffect(() => {
    const secciones = document.querySelectorAll('[data-acento="arcilla"]');
    if (secciones.length === 0 || typeof IntersectionObserver === "undefined") {
      return;
    }

    const visibles = new Set<Element>();
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) visibles.add(e.target);
          else visibles.delete(e.target);
        }
        setOculto(visibles.size > 0);
      },
      { threshold: 0 },
    );

    secciones.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <a
      href={waLink(
        mensaje ??
          `Hola, vi el sitio de ${BRAND.name} y quiero preguntar por una pieza.`,
      )}
      onClick={() => trackContact({ content_name: "whatsapp-flotante" })}
      target="_blank"
      rel="noopener"
      aria-label="Escribir por WhatsApp"
      // `inert` además de invisible: oculto no puede seguir siendo enfocable
      // con el teclado, o el foco saltaría a un botón que no se ve.
      inert={oculto || undefined}
      className={cn(
        "fixed right-5 bottom-5 z-50 inline-flex h-14 w-14 items-center justify-center bg-arcilla text-blanco transition-opacity duration-[120ms] hover:bg-arcilla-oscura",
        oculto && "pointer-events-none opacity-0",
      )}
    >
      {/* Glifo de WhatsApp: lucide no trae marcas comerciales. Trazo 1.75. */}
      <svg
        viewBox="0 0 24 24"
        width="26"
        height="26"
        fill="none"
        stroke="currentColor"
        strokeWidth={TRAZO}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    </a>
  );
}
