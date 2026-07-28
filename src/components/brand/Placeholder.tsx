import { cn } from "@/lib/cn";

type Props = {
  /** Qué falta, en texto legible. Nunca "lorem ipsum", nunca foto de stock. */
  etiqueta: string;
  /** Relación de aspecto real del activo que va a ocupar este hueco. */
  ratio?: string;
  className?: string;
};

/**
 * Placeholder declarado — §14.
 *
 * Mientras no existan las fotos reales, el desarrollo procede con bloques en
 * Cemento con la relación de aspecto correcta y una etiqueta visible de qué
 * falta. Nunca fotos de stock, nunca texto de relleno en latín.
 *
 * Grafito sobre Cemento = 9.72:1, así que la etiqueta es legible de verdad.
 */
export function Placeholder({ etiqueta, ratio = "4 / 3", className }: Props) {
  return (
    <div
      role="img"
      aria-label={`Pendiente: ${etiqueta}`}
      style={{ aspectRatio: ratio }}
      className={cn(
        "flex w-full items-center justify-center border border-texto-secundario bg-cemento p-6",
        className,
      )}
    >
      <span className="cifra text-center text-detalle text-grafito">
        {etiqueta}
      </span>
    </div>
  );
}
