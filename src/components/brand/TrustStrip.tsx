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
 */
export function TrustStrip({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "grid gap-px border border-cemento bg-cemento sm:grid-cols-3",
        className,
      )}
    >
      {DATOS.map(({ Icono, texto }) => (
        <li
          key={texto}
          className="flex items-center justify-center gap-3 bg-hueso px-6 py-6 text-center"
        >
          <Icono
            size={22}
            strokeWidth={TRAZO}
            aria-hidden="true"
            className="shrink-0 text-grafito"
          />
          <span className="font-titulo text-detalle font-medium text-grafito">
            {texto}
          </span>
        </li>
      ))}
    </ul>
  );
}
