/**
 * Fuente única del nombre de marca — §2 del spec.
 *
 * El nombre es provisional (sin verificar en IMPI, sin logo). NADA fuera de este
 * archivo debe escribir el nombre literal: ni componentes, ni metadatos, ni schema.
 * Criterio de aceptación 13: `grep -ri "bisel" src/` solo debe devolver este archivo.
 *
 * Cuando el nombre definitivo exista, se cambia aquí y el sitio entero lo hereda.
 */
export const BRAND = {
  name: "Bisel",
  nameUpper: "BISEL",
  legalName: "Bisel", // PENDIENTE §14.1 — falta constitución
  descriptor: "Taller de impresión 3D en Guadalajara",
  domain: "https://bisel.mx", // PENDIENTE §14.1 — dominio sin registrar
  email: "hola@bisel.mx",
  /** PENDIENTE §14.6 — sin confirmar si es el mismo de Mattera o una línea nueva. */
  whatsapp: "523327874747",
  city: "Guadalajara",
  state: "Jalisco",
  country: "MX",
  instagram: "", // PENDIENTE §14
  facebook: "", // PENDIENTE §14
  founder: "Samuel",
} as const;

/** Redes ya existentes, sin huecos vacíos. Alimenta `sameAs` del schema (§8.3). */
export const REDES: readonly string[] = [
  BRAND.instagram,
  BRAND.facebook,
].filter((u) => u.length > 0);

/**
 * Enlace de WhatsApp con mensaje prellenado.
 * Centralizado aquí para que el número viva en un solo sitio (§14.6).
 */
export function waLink(mensaje: string): string {
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

/**
 * Base real del despliegue actual.
 *
 * `BRAND.domain` es el dominio definitivo (pendiente de registro, §14.1). El
 * preview de GitHub Pages vive en otra URL, así que los canónicos, el sitemap y
 * el JSON-LD deben apuntar a donde el sitio está de verdad, no a un dominio que
 * todavía no resuelve.
 */
export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || BRAND.domain;

/** ¿Es el preview estático de GitHub Pages y no el sitio definitivo? */
export const ES_PREVIEW = BASE_URL !== BRAND.domain;

/** URL absoluta — `canonical`, `sitemap` y JSON-LD la exigen absoluta (§8.1). */
export function url(path = "/"): string {
  return new URL(path, BASE_URL).toString();
}
