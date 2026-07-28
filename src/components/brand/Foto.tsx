import Image from "next/image";

import { cn } from "@/lib/cn";

type Props = {
  /** Ruta dentro de /medios, sin extensión. Ej. "taller". */
  nombre: string;
  /** `alt` descriptivo real: sirve al lector de pantalla y al buscador (§6). */
  alt: string;
  ancho: number;
  alto: number;
  /** `sizes` explícito, obligatorio en todas (§6). */
  sizes: string;
  /** Solo la imagen del héroe lleva `priority` (§6). */
  priority?: boolean;
  className?: string;
  /** Oculta el sello. Solo para fotos reales, nunca para generadas. */
  real?: boolean;
};

/**
 * Foto del sitio.
 *
 * TODAS las imágenes de /medios están GENERADAS con IA, no fotografiadas. Por
 * eso llevan un sello visible: §13 prohíbe pasar un render por foto de
 * producto y el criterio 12 prohíbe contenido inventado. Marcadas, el visitante
 * sabe qué está viendo y nadie confunde el demo con documentación del taller.
 *
 * PENDIENTE §14.3: sustituir por fotos reales. En cuanto una lo sea, se pasa
 * `real` y el sello desaparece.
 *
 * `width` y `height` siempre presentes para que el CLS sea cero (§6).
 */
export function Foto({
  nombre,
  alt,
  ancho,
  alto,
  sizes,
  priority = false,
  className,
  real = false,
}: Props) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={`/medios/${nombre}.webp`}
        alt={alt}
        width={ancho}
        height={alto}
        sizes={sizes}
        priority={priority}
        // Sin `priority`, todo lo que está bajo el fold se carga en diferido.
        loading={priority ? undefined : "lazy"}
        className="h-full w-full object-cover"
      />

      {!real && (
        <span className="cifra absolute right-2 bottom-2 border border-grafito bg-hueso/95 px-2 py-1 text-[0.625rem] tracking-wide text-grafito uppercase">
          Imagen generada
        </span>
      )}
    </div>
  );
}
