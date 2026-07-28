import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Botón re-estilizado a los tokens del §4 — §11.
 *
 * Se quitó todo `rounded-*`, `shadow-*` y `ring-*` que traía por defecto.
 * §5.5: el cambio de estado es de color en 120ms. Sin sombra, sin elevación,
 * sin escala. El foco es contorno de 2px en Grafito con 2px de offset, heredado
 * de la regla global `:focus-visible`.
 *
 * Altura mínima 44px en todas las variantes: es el mínimo de toque del §6.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 font-titulo text-[0.9375rem] font-semibold whitespace-nowrap transition-colors duration-[120ms] outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[18px]",
  {
    variants: {
      variant: {
        /* CTA por defecto: Grafito sólido. Hueso sobre Grafito = 14.84:1. */
        default: "bg-grafito text-hueso hover:bg-texto-secundario",

        /* Contorno Grafito. Borde en Grafito, no en Cemento (§4.1.1). */
        outline:
          "border-2 border-grafito bg-transparent text-grafito hover:bg-grafito hover:text-hueso",

        /* EL acento. Blanco sobre Arcilla = 4.96:1; hover 7.53:1.
 Solo puede aparecer UNA vez por viewport (§4.1 regla 1). */
        accent: "bg-arcilla text-blanco hover:bg-arcilla-oscura",

        /* Sobre fondo Grafito: invierte para seguir siendo legible. */
        inverso:
          "border-2 border-hueso bg-transparent text-hueso hover:bg-hueso hover:text-grafito",

        /* Texto pequeño en acento va en Arcilla oscura (6.68:1), nunca en
 Arcilla (4.40:1, no pasa AA por debajo de 24px) — §4.1.1. */
        link: "text-arcilla-oscura underline underline-offset-4 hover:text-grafito",
      },
      size: {
        default: "min-h-[44px] px-6 py-3",
        sm: "min-h-[44px] px-4 py-2 text-detalle",
        lg: "min-h-[52px] px-8 py-4 text-cuerpo",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
