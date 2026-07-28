import type { NombreForma } from "@/components/piezas/formas";

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
  /** Dibujo técnico de la pieza mientras no exista la foto (§14.3). */
  forma: NombreForma;
  /** Enlace saliente a MercadoLibre o a la tienda. Este sitio no cobra. */
  enlace?: string;
  /**
   * `true` = ficha de muestra para ver la rejilla funcionando, NO inventario.
   * La tarjeta lo dice en pantalla. Ver la nota de abajo.
   */
  muestra: boolean;
};

/**
 * Catálogo — §7.3.
 *
 * PENDIENTE §14.5: no hay productos reales con medidas y precios todavía.
 *
 * Estas fichas son de MUESTRA y cada tarjeta lo declara en pantalla. El §13 y
 * el criterio 12 prohíben "catálogo maquetado con productos que todavía no
 * existen", y la prohibición apunta a hacerlos pasar por inventario real: eso
 * es lo que destruye la credibilidad y lo que genera pedidos que no se pueden
 * surtir. Marcadas como lo que son, sirven para revisar la rejilla, el hover a
 * la textura de capa y la ficha, sin engañar a nadie.
 *
 * Al publicar de verdad: sustituir por piezas reales, `muestra: false`, foto de
 * producto y `enlace` a la tienda. El botón de compra no aparece mientras la
 * ficha sea de muestra, para que sea imposible pedir algo que no existe.
 */
export const PRODUCTOS: readonly Producto[] = [
  {
    id: "organizador-escritorio",
    nombre: "Organizador de escritorio",
    descripcion:
      "Tres compartimentos para plumas, clips y cables. Se apoya sin resbalar.",
    medidas: "18.4 × 9.0 × 7.2 cm",
    material: "PLA",
    precio: 320,
    forma: "organizador",
    muestra: true,
  },
  {
    id: "soporte-audifonos",
    nombre: "Soporte para audífonos",
    descripcion:
      "Se atornilla bajo el escritorio y libera la superficie. Aguanta diademas anchas.",
    medidas: "21.0 × 11.5 × 8.0 cm",
    material: "PETG",
    precio: 380,
    forma: "soporte",
    muestra: true,
  },
  {
    id: "perilla-repuesto",
    nombre: "Perilla de repuesto",
    descripcion:
      "Para estufas y lavadoras cuyo refaccionario ya cerró. El eje se hace a tu medida.",
    medidas: "4.2 × 4.2 × 3.0 cm",
    material: "PETG",
    precio: 180,
    forma: "perilla",
    muestra: true,
  },
  {
    id: "maceta-interior",
    nombre: "Maceta de paredes rectas",
    descripcion:
      "Con plato integrado, no gotea sobre el mueble. Para suculentas y cactus.",
    medidas: "12.0 × 12.0 × 11.0 cm",
    material: "PLA",
    precio: 260,
    forma: "maceta",
    muestra: true,
  },
  {
    id: "tope-puerta",
    nombre: "Tope de puerta",
    descripcion:
      "Cuña flexible que agarra en piso liso. No raya y no se desliza.",
    medidas: "12.4 × 6.0 × 5.0 cm",
    material: "TPU",
    precio: 210,
    forma: "tope",
    muestra: true,
  },
  {
    id: "gancho-pared",
    nombre: "Gancho de pared",
    descripcion:
      "Se atornilla o se pega. Probado con 4 kg colgando sin deformarse.",
    medidas: "11.0 × 7.6 × 2.0 cm",
    material: "PETG",
    precio: 195,
    forma: "gancho",
    muestra: true,
  },
];

/** ¿El catálogo tiene piezas reales, o todo lo publicado es de muestra? */
export const HAY_PRODUCTOS_REALES = PRODUCTOS.some((p) => !p.muestra);

/** Formato de precio mexicano, sin decimales sueltos. */
export function precioMXN(v: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(v);
}
