import "server-only";

import { z } from "zod";

import { esCorreoOTelefono, PLAZOS, USOS } from "./cotizacion";

/**
 * Validación de servidor — §7.2. La única que cuenta.
 *
 * `server-only` hace que el build falle si alguien importa este archivo desde
 * un componente de cliente, que es justo lo que volvería a meter Zod en el
 * bundle del navegador.
 */
export const esquemaCotizacion = z.object({
  descripcion: z
    .string()
    .trim()
    .min(15, "Cuéntame un poco más: ¿qué es la pieza y para qué la ocupas?")
    .max(2000, "Quedó muy largo. Resúmelo en menos de 2000 caracteres."),

  medidas: z
    .string()
    .trim()
    .min(2, "Aunque sea aproximadas: largo, ancho y alto en centímetros.")
    .max(300, "Con las medidas principales basta."),

  uso: z.enum(
    USOS.map((u) => u.valor) as [string, ...string[]],
    "Dime dónde va a vivir la pieza.",
  ),

  plazo: z.enum(
    PLAZOS.map((p) => p.valor) as [string, ...string[]],
    "Dime para cuándo la necesitas.",
  ),

  nombre: z
    .string()
    .trim()
    .min(2, "¿Cómo te llamo?")
    .max(120, "Ese nombre es más largo de lo que esperaba."),

  contacto: z
    .string()
    .trim()
    .min(7, "Déjame un WhatsApp o un correo para contestarte.")
    .max(160, "Revisa el dato de contacto, quedó muy largo.")
    .refine(
      esCorreoOTelefono,
      "Escríbelo como correo (hola@correo.com) o como teléfono a 10 dígitos.",
    ),
});
