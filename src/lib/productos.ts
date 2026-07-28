export type Producto = {
  id: string;
  nombre: string;
  /** Descripción corta. Primera oración = qué es (§9 regla 2). */
  descripcion: string;
  /** Medidas reales con unidad. Se muestran en cifras tabulares. */
  medidas: string;
  material: "PLA" | "PETG" | "TPU";
  /** Precio en MXN. */
  precio: number;
  /** Foto principal, ya en el proyecto. */
  foto?: string;
  /** Macro de la textura de capa — se muestra en hover (§5.5). */
  fotoCapas?: string;
  /** Enlace saliente a MercadoLibre o a la tienda. Este sitio no cobra. */
  enlace: string;
};

/**
 * Catálogo — §7.3.
 *
 * PENDIENTE §14.5: no hay productos reales con medidas y precios todavía.
 *
 * El array está vacío a propósito. Maquetar un catálogo con productos que no
 * existen es exactamente lo que prohíben el §13 y el criterio 12. Mientras siga
 * vacío, la página muestra un estado vacío honesto que invita a cotizar.
 */
export const PRODUCTOS: readonly Producto[] = [];

/** Formato de precio mexicano, sin decimales sueltos. */
export function precioMXN(v: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(v);
}
