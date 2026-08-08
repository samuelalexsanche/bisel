/**
 * Meta Pixel — capa tipada sobre fbq (§14.7).
 *
 * El ID vive en NEXT_PUBLIC_META_PIXEL_ID (público por diseño: el pixel va en
 * el HTML de todas las páginas). Sin ID, TODAS las funciones son no-op: el
 * sitio no carga el script ni pierde un byte en el que no va a pautar.
 *
 * Eventos estándar de Meta usados aquí:
 *   - PageView            → cada página (automático, en el script base)
 *   - ViewContent         → presupuesto generado en /calculadora
 *   - Contact             → clic en el botón flotante de WhatsApp
 *   - Lead                → cotización enviada con éxito
 */
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

// Exportado para que el script base (MetaPixel) lo use en el `init`.
export { PIXEL_ID };

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export const PIXEL_ACTIVO = PIXEL_ID.length > 0;

type Fbq = (evento: string, ...args: unknown[]) => void;

/** noop cuando no hay pixel configurado: el resto del sitio no cambia. */
const sinPixel: Fbq = () => {};

function fbq(): Fbq {
  if (!PIXEL_ACTIVO) return sinPixel;
  return (...args) => {
    window.fbq?.("track", ...(args as [string, ...unknown[]]));
  };
}

/** Contenido visto (ej. presupuesto generado). */
export function trackViewContent(datos?: Record<string, unknown>) {
  fbq()("ViewContent", datos);
}

/** Clic en un canal de contacto (WhatsApp, teléfono, formulario). */
export function trackContact(datos?: Record<string, unknown>) {
  fbq()("Contact", datos);
}

/** Lead: cotización enviada con éxito. Es LA conversión del negocio. */
export function trackLead(datos?: Record<string, unknown>) {
  fbq()("Lead", datos);
}
