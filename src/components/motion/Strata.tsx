import { cn } from "@/lib/cn";

type Props = {
  /**
   * `fondo` — textura del plano 0 (§5.2).
   * `separador` — líneas visibles entre secciones (§5.3).
   */
  variante?: "fondo" | "separador";
  /** Sobre Grafito las líneas se invierten a Cemento para seguir viéndose. */
  oscuro?: boolean;
  /**
   * Opacidad de las líneas.
   *
   * §5.2 fija el plano 0 en 0.04. Con el color corregido a texto-secundario
   * (7.46:1 sobre Hueso en vez de 1.53:1) hace falta menos alfa para que la
   * textura exista, pero 0.04 sigue siendo invisible. Se sube donde los
   * estratos tienen que leerse. Siguen siendo decorativos, así que la regla
   * del §4.1.1 se respeta igual.
   */
  intensidad?: number;
  /** Separación entre líneas. §5.3 la fija en 12px. */
  separacion?: number;
  className?: string;
};

export function Strata({
  variante = "fondo",
  oscuro = false,
  intensidad,
  separacion,
  className,
}: Props) {
  const alpha = intensidad ?? (variante === "separador" ? 0.9 : 0.11);

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
        oscuro && "strata--oscuro",
        variante === "separador" && "strata--separador",
        className,
      )}
    />
  );
}
