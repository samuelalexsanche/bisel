import { cn } from "@/lib/cn";

type Props = {
  /**
   * `fondo` — textura del plano 0 (§5.2).
   * `separador` — líneas visibles entre secciones (§5.3).
   */
  variante?: "fondo" | "separador";
  /**
   * Opacidad de las líneas.
   *
   * §5.2 fija el plano 0 en 0.04, pero Cemento al 4% sobre Hueso da una
   * diferencia que no se percibe: el plano deja de existir para el ojo y la
   * sección se lee plana. Se sube donde los estratos tienen que leerse como
   * textura de verdad. Siguen siendo Cemento y siguen siendo decorativos, así
   * que la regla de contraste del §4.1.1 se respeta igual.
   */
  intensidad?: number;
  /** Separación entre líneas. §5.3 la fija en 12px. */
  separacion?: number;
  className?: string;
};

export function Strata({
  variante = "fondo",
  intensidad,
  separacion,
  className,
}: Props) {
  const alpha = intensidad ?? (variante === "separador" ? 1 : 0.22);

  return (
    <div
      aria-hidden="true"
      style={
        {
          "--strata-alpha": alpha,
          ...(separacion ? { "--strata-sep": `${separacion}px` } : {}),
        } as React.CSSProperties
      }
      className={cn(
        "strata pointer-events-none",
        variante === "separador" && "strata--separador",
        className,
      )}
    />
  );
}
