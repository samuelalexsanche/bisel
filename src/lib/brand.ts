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
  domain: "https://bisel3d.com",
  email: "hola@bisel3d.com",
  /** PENDIENTE §14.6 — sin confirmar si es el mismo de Mattera o una línea nueva. */
  whatsapp: "523327874747",
  city: "Guadalajara",
  state: "Jalisco",
  country: "MX",
  instagram: "https://www.instagram.com/bisel3d",
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
 * `BRAND.domain` es el dominio definitivo. Un despliegue de preview puede
 * apuntar a otra URL vía NEXT_PUBLIC_SITE_URL, y entonces los canónicos, el
 * sitemap y el JSON-LD siguen a donde el sitio está de verdad.
 */
export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || BRAND.domain;

/**
 * El sitio SOLO se indexa cuando se activa a propósito.
 *
 * Ya vive en su dominio, pero mientras las fotos sean generadas y el catálogo
 * sea de muestra, dejar que Google lo indexe significa cachear como
 * documentación algo que todavía no lo es. Se levanta poniendo
 * NEXT_PUBLIC_INDEXABLE=true en el workflow.
 */
export const INDEXABLE = process.env.NEXT_PUBLIC_INDEXABLE === "true";

/**
 * URL absoluta — `canonical`, `sitemap` y JSON-LD la exigen absoluta (§8.1).
 *
 * Añade la barra final porque el export estático va con `trailingSlash: true`:
 * la página se sirve en /cotiza/ y /cotiza solo redirige. Un canónico que
 * apunta a la variante que redirige es un canónico mal puesto, y en el sitemap
 * hace que el rastreador gaste una petición de más por URL.
 *
 * Se excluyen las rutas de archivo (las que llevan punto en el último tramo,
 * como /sitemap.xml o /medios/foto.webp), que no llevan barra.
 */
export function url(path = "/"): string {
  const ultimoTramo = path.split("/").filter(Boolean).pop() ?? "";
  const esArchivo = ultimoTramo.includes(".");
  const normalizado = esArchivo || path.endsWith("/") ? path : `${path}/`;
  return new URL(normalizado, BASE_URL).toString();
}
