import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  /** Sobre fondo Grafito el trazo y el texto se invierten a Hueso. */
  invertido?: boolean;
};

/**
 * Placeholder tipográfico del logo — §2.
 *
 * PENDIENTE §14.2: no existe el SVG real. Cuando exista, se sustituye SOLO este
 * archivo y el resto del sitio no se entera.
 *
 * El nombre nunca se escribe literal aquí: sale de BRAND (criterio 13).
 */
export function Logo({ className, invertido = false }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center border-2 px-3 py-1.5 font-titulo text-[1.0625rem] leading-none font-bold tracking-[-0.02em]",
        invertido ? "border-hueso text-hueso" : "border-grafito text-grafito",
        className,
      )}
    >
      {BRAND.nameUpper}
    </span>
  );
}
