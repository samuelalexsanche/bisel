import { cn } from "@/lib/cn";

type Props = {
  /**
   * `fondo` — textura del plano 0, Cemento al 4% (§5.2).
   * `separador` — líneas visibles entre secciones (§5.3).
   */
  variante?: "fondo" | "separador";
  className?: string;
};

/**
 * La firma gráfica — §5.3. Líneas horizontales de 1px cada 12px, en Cemento.
 *
 * Componente de servidor a propósito: son líneas dibujadas por CSS, así que no
 * aporta ni un byte al bundle del cliente.
 *
 * Decorativo puro: `aria-hidden` para no ensuciar el árbol de accesibilidad.
 */
export function Strata({ variante = "fondo", className }: Props) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "strata pointer-events-none",
        variante === "separador" && "strata--separador",
        className,
      )}
    />
  );
}
