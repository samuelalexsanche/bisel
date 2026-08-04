import type { ReactNode } from "react";

import { FondoFoto } from "@/components/layout/FondoFoto";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { Strata } from "@/components/motion/Strata";
import { cn } from "@/lib/cn";

/**
 * Tonos de superficie. Los cuatro salen de la paleta del §4.1 — no hay color
 * nuevo, cambia la superficie sobre la que se apoya el texto.
 *
 * Contrastes verificados sobre cada fondo:
 *   hueso        Grafito 14.84 · texto-secundario 7.46
 *   cemento      Grafito  9.72 · texto-secundario 4.88
 *   arcillaSuave Grafito 14.13 · texto-secundario 7.10
 *   grafito      Hueso   14.84 · Cemento          9.72
 */
export type Tono = "hueso" | "cemento" | "arcillaSuave" | "grafito";

const FONDO: Record<Tono, string> = {
  hueso: "bg-hueso text-grafito",
  cemento: "bg-cemento text-grafito",
  arcillaSuave: "bg-arcilla-suave text-grafito",
  grafito: "sobre-grafito bg-grafito text-hueso",
};

type Props = {
  children: ReactNode;
  tono?: Tono;
  /** Estratos del plano 0 al fondo de la sección. */
  estratos?: boolean;
  intensidadEstratos?: number;
  /** `id` del encabezado que titula la sección. */
  titulaPor?: string;
  className?: string;
  /** Contenido que se sale de la caja: se permite desbordar. */
  desbordable?: boolean;
  /** Fondo fotográfico de /medios/fondos, sin extensión. */
  fondo?: string;
  opacidadFondo?: number;
};

/**
 * Sección con tono propio.
 *
 * Existe porque el sitio estaba al 85% sobre un único fondo Hueso y se leía
 * como una hoja en blanco con tarjetas encima. §4.1 reparte Grafito al 25% de
 * cada pantalla, y ese 25% no puede salir solo del texto: tiene que haber
 * superficie. Alternar tonos es lo que le da ritmo al scroll.
 */
export function Seccion({
  children,
  tono = "hueso",
  estratos = false,
  intensidadEstratos,
  titulaPor,
  className,
  desbordable = false,
  fondo,
  opacidadFondo,
}: Props) {
  const oscuro = tono === "grafito";

  return (
    <section
      aria-labelledby={titulaPor}
      className={cn(
        "relative",
        !desbordable && "overflow-hidden",
        FONDO[tono],
        className,
      )}
    >
      {/* El fondo va lo primero: por debajo de estratos y de contenido. */}
      {fondo && <FondoFoto nombre={fondo} opacidad={opacidadFondo} />}

      {estratos && (
        /* Plano 0 · se extiende más allá de la sección para que el
           desplazamiento no descubra los bordes al hacer scroll. */
        <ParallaxLayer
          depth={0}
          className="absolute inset-x-0 -top-32 -bottom-32"
        >
          <Strata
            className="h-full w-full"
            oscuro={oscuro}
            intensidad={intensidadEstratos}
            separacion={14}
          />
        </ParallaxLayer>
      )}

      <div className="relative">{children}</div>
    </section>
  );
}
