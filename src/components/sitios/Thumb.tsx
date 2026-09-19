import { cn } from "@/lib/cn";

type Props = {
  /** Dos o tres letras del sitio. */
  siglas: string;
  /** Nombre completo, para el atributo title. */
  nombre: string;
  /** `sm` en la tabla comparativa, `md` en las fichas. */
  tamano?: "sm" | "md";
  className?: string;
};

/**
 * Miniatura de un sitio de modelos.
 *
 * Es un monograma propio, NO el logo ajeno: hotlinkear favicons o logos de
 * terceros trae tres problemas — dependencia externa que se cae, imágenes que
 * se rompen sin aviso y uso de marca ajena. El mosaico usa la paleta del sitio
 * y el mismo motivo de capas que las fichas de catálogo.
 *
 * Decorativa: el nombre del sitio va como texto al lado, así que no necesita
 * texto alternativo (y por eso va con `aria-hidden`).
 */
export function Thumb({ siglas, nombre, tamano = "md", className }: Props) {
  return (
    <span
      aria-hidden="true"
      title={nombre}
      className={cn(
        "cifra relative flex shrink-0 items-center justify-center overflow-hidden border border-grafito bg-grafito",
        tamano === "sm" ? "h-9 w-9" : "h-14 w-14",
        className,
      )}
    >
      <span
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0 5px, var(--color-hueso) 5px 6px)",
        }}
      />
      <span
        className={cn(
          "relative font-titulo text-hueso",
          tamano === "sm" ? "text-[0.6875rem]" : "text-h3",
        )}
      >
        {siglas}
      </span>
    </span>
  );
}
