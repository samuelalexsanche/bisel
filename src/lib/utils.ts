import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Helper que esperan los componentes de shadcn/ui.
 *
 * tailwind-merge NO conoce los tokens del §4, así que por defecto mete
 * `text-hueso` (color) y `text-cuerpo` (tamaño) en el mismo grupo de conflicto
 * y descarta uno de los dos. Eso ya provocó un botón con texto Grafito sobre
 * fondo Grafito — invisible. Aquí se le declaran ambas escalas para que
 * distinga color de tamaño.
 *
 * Si se añade un token nuevo al §4, hay que añadirlo también a esta lista.
 */
const COLORES = [
  "hueso",
  "grafito",
  "arcilla",
  "cemento",
  "texto-secundario",
  "arcilla-oscura",
  "arcilla-suave",
  "blanco",
] as const;

const TAMANOS = ["h1", "h2", "h3", "cuerpo", "detalle"] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...TAMANOS] }],
      "text-color": [{ text: [...COLORES] }],
      "bg-color": [{ bg: [...COLORES] }],
      "border-color": [{ border: [...COLORES] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
