import { FileCheck, MapPin, Truck } from "lucide-react";

import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { TRAZO } from "@/lib/iconos";

const DATOS = [
  { Icono: Truck, texto: "Envío a todo México" },
  { Icono: MapPin, texto: `Hecho en ${BRAND.city}` },
  { Icono: FileCheck, texto: "Garantía por escrito" },
] as const;

/**
 * Franja de confianza — §7.0. Tres datos, esquinas rectas, iconos lineales
 * de trazo 1.75. Nada aquí es una cifra sin respaldo: son hechos verificables.
 *
 * En oscuro el texto va en Hueso (14.84:1) y los separadores en Cemento
 * (9.72:1 sobre Grafito).
 */
export function TrustStrip({
  className,
  oscuro = false,
}: {
  className?: string;
  oscuro?: boolean;
}) {
  return (
    <ul
      className={cn(
        "grid gap-px sm:grid-cols-3",
        oscuro ? "bg-cemento" : "border border-cemento bg-cemento",
        className,
      )}
    >
      {DATOS.map(({ Icono, texto }) => (
        <li
          key={texto}
          className={cn(
            "flex items-center justify-center gap-3 px-6 py-7 text-center",
            oscuro ? "bg-grafito" : "bg-hueso",
          )}
        >
          <Icono
            size={22}
            strokeWidth={TRAZO}
            aria-hidden="true"
            className={cn("shrink-0", oscuro ? "text-hueso" : "text-grafito")}
          />
          <span
            className={cn(
              "font-titulo text-detalle font-medium",
              oscuro ? "text-hueso" : "text-grafito",
            )}
          >
            {texto}
          </span>
        </li>
      ))}
    </ul>
  );
}
