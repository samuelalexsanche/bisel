"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Logo } from "@/components/brand/Logo";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/catalogo", texto: "Catálogo" },
  { href: "/modelos", texto: "Modelos" },
  { href: "/blog", texto: "Blog" },
  { href: "/cotiza", texto: "Cotiza tu pieza" },
  { href: "/como-funciona", texto: "Cómo funciona" },
  { href: "/quien-hace-esto", texto: "Quién hace esto" },
] as const;

/**
 * Cabecera — §7.0.
 *
 * Logo a la izquierda, navegación a la derecha, fondo Hueso opaco, borde
 * inferior de 1px en Cemento. Sin blur y sin transparencia en ningún estado.
 *
 * El umbral de 80px se detecta con un centinela y el IntersectionObserver, no
 * con un listener de `scroll`: un listener de scroll en el elemento fijo de
 * todas las páginas es justo lo que §5.4.3 quiere evitar.
 */
export function Header() {
  const centinela = useRef<HTMLDivElement>(null);
  const [desplazado, setDesplazado] = useState(false);

  useEffect(() => {
    const el = centinela.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entrada]) => setDesplazado(!entrada.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Centinela de 80px: mientras se ve, no hemos pasado el umbral. */}
      <div ref={centinela} aria-hidden="true" className="absolute top-0 h-20" />

      <header
        className={cn(
          "sticky top-0 z-40 bg-hueso",
          // El borde aparece al despegar del inicio: separa la cabecera del
          // contenido sin recurrir a sombra, que está prohibida (§4.1 regla 2).
          desplazado
            ? "border-b border-cemento"
            : "border-b border-transparent",
        )}
      >
        <div className="contenido flex min-h-[72px] items-center justify-between gap-6 py-3">
          <Link
            href="/"
            aria-label={`${BRAND.name} — inicio`}
            className="shrink-0"
          >
            <Logo />
          </Link>

          <nav aria-label="Principal">
            <ul className="flex flex-wrap items-center justify-end gap-x-6 gap-y-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-[44px] items-center text-detalle text-texto-secundario transition-colors duration-[120ms] hover:text-grafito"
                  >
                    {item.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
