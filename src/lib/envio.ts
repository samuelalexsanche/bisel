import { esCorreoOTelefono, type Cotizacion } from "./cotizacion";

export type ResultadoEnvio =
  | { estado: "ok" }
  | { estado: "sin-destino" }
  | { estado: "error"; mensaje: string };

/**
 * Envío de la cotización.
 *
 * Vive en el cliente porque el sitio se publica como export estático en GitHub
 * Pages y ahí no hay servidor que ejecute una Server Action.
 *
 * PENDIENTE: no hay destino configurado. Sin `NEXT_PUBLIC_COTIZACIONES_WEBHOOK`
 * esta función NO finge que envió nada: devuelve `sin-destino` y la interfaz
 * manda a WhatsApp, que es el canal real del negocio. Fingir un estado de éxito
 * sería el tipo de contenido inventado que prohíbe el criterio 12, y además
 * perdería clientes de verdad.
 *
 * Cuando el sitio se mueva a Vercel con backend, esto vuelve a ser una Server
 * Action y la validación de Zod de `cotizacion.server.ts` se ejecuta en el
 * servidor, que es donde cuenta.
 */
export async function enviarCotizacion(
  datos: Cotizacion,
): Promise<ResultadoEnvio> {
  // Repaso mínimo antes de salir a la red. La validación de verdad la hace
  // react-hook-form con las REGLAS antes de llegar aquí.
  if (
    !datos.descripcion.trim() ||
    !datos.nombre.trim() ||
    !esCorreoOTelefono(datos.contacto.trim())
  ) {
    return {
      estado: "error",
      mensaje: "Revisa los datos y vuelve a intentarlo.",
    };
  }

  const destino = process.env.NEXT_PUBLIC_COTIZACIONES_WEBHOOK;
  if (!destino) return { estado: "sin-destino" };

  try {
    const res = await fetch(destino, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...datos, recibido: new Date().toISOString() }),
    });

    if (!res.ok) {
      return {
        estado: "error",
        mensaje: "No se pudo enviar. Escríbeme por WhatsApp y lo vemos ahí.",
      };
    }
    return { estado: "ok" };
  } catch {
    return {
      estado: "error",
      mensaje: "No se pudo enviar. Escríbeme por WhatsApp y lo vemos ahí.",
    };
  }
}
