import type { NombreForma } from "@/components/piezas/formas";

/* ============================================================================
   Catálogo de modelos — "el diseño es gratis, cobro la impresión"

   EL PUNTO CRÍTICO ES LA LICENCIA.

   Buena parte de lo que hay en Printables, Thingiverse y MakerWorld es
   Creative Commons NO COMERCIAL, y cobrar por imprimir esos modelos NO está
   permitido. Elegir "un buen repositorio" no resuelve nada: la licencia va por
   modelo, no por sitio.

   La solución es de tipos, no de disciplina: `LicenciaComercial` solo admite
   licencias que permiten uso comercial, así que `licencia: "CC-BY-NC"` NO
   COMPILA. Y un modelo de un tercero exige `autor` y `urlOrigen` — sin
   crédito no se puede publicar, tampoco compila.
   ========================================================================= */

export const LICENCIAS = {
  propio: {
    nombre: "Diseño propio",
    resumen: "Lo dibujé yo. Te lo doy gratis, cobro la impresión.",
    requiereCredito: false,
  },
  CC0: {
    nombre: "CC0 · Dominio público",
    resumen: "Sin restricciones. Uso comercial permitido.",
    requiereCredito: false,
  },
  "CC-BY": {
    nombre: "CC BY",
    resumen: "Uso comercial permitido dando crédito al autor.",
    requiereCredito: true,
  },
  "CC-BY-SA": {
    nombre: "CC BY-SA",
    resumen:
      "Uso comercial permitido dando crédito; las modificaciones se comparten igual.",
    requiereCredito: true,
  },
} as const;

/**
 * Licencias publicables.
 *
 * Deliberadamente NO existen aquí CC-BY-NC, CC-BY-NC-SA, CC-BY-ND ni ninguna
 * variante NC o ND. No es un olvido: si alguien intenta añadir un modelo con
 * una de esas, TypeScript lo rechaza antes de que llegue al sitio.
 */
export type LicenciaComercial = keyof typeof LICENCIAS;

type ModeloBase = {
  id: string;
  nombre: string;
  /** Primera oración = qué es (§9 regla 2). */
  descripcion: string;
  /** Dibujo técnico que lo representa. */
  forma: NombreForma;
  /** Medidas reales con unidad. */
  medidas: string;
  materialSugerido: "PLA" | "PETG" | "TPU";
  /** Lo que cuesta imprimirlo, en MXN. El diseño va en cero. */
  precioImpresion: number;
};

/**
 * Un modelo publicable.
 *
 * La unión discriminada es la que hace cumplir la regla: si el modelo NO es
 * propio, `autor` y `urlOrigen` son obligatorios. No hay forma de publicar un
 * diseño ajeno sin decir de quién es y de dónde salió.
 */
export type Modelo =
  | (ModeloBase & {
      licencia: "propio";
      autor?: never;
      urlOrigen?: never;
    })
  | (ModeloBase & {
      licencia: Exclude<LicenciaComercial, "propio">;
      autor: string;
      urlOrigen: string;
    });

/**
 * El catálogo arranca con diseños PROPIOS a propósito.
 *
 * Publicar modelos de terceros exige verificar la licencia uno por uno, y una
 * atribución equivocada es un problema legal peor que un producto inventado.
 * Con diseños propios la propuesta funciona igual —"el diseño es gratis, cobro
 * la impresión"— y no hay nada que verificar.
 *
 * Para añadir uno de terceros: comprobar su licencia en el origen, y si es CC0,
 * CC-BY o CC-BY-SA, añadirlo con `autor` y `urlOrigen`. Si es NC o ND, no se
 * puede y el tipo lo impedirá.
 */
export const MODELOS: readonly Modelo[] = [
  {
    id: "organizador-escritorio",
    nombre: "Organizador de escritorio",
    descripcion:
      "Tres compartimentos para plumas, clips y cables. Se apoya sin resbalar.",
    forma: "organizador",
    medidas: "18.4 × 9.0 × 7.2 cm",
    materialSugerido: "PLA",
    precioImpresion: 320,
    licencia: "propio",
  },
  {
    id: "soporte-audifonos",
    nombre: "Soporte para audífonos",
    descripcion:
      "Se atornilla bajo el escritorio y libera la superficie. Aguanta diademas anchas.",
    forma: "soporte",
    medidas: "21.0 × 11.5 × 8.0 cm",
    materialSugerido: "PETG",
    precioImpresion: 380,
    licencia: "propio",
  },
  {
    id: "maceta-interior",
    nombre: "Maceta de paredes rectas",
    descripcion:
      "Con plato integrado, no gotea sobre el mueble. Para suculentas y cactus.",
    forma: "maceta",
    medidas: "12.0 × 12.0 × 11.0 cm",
    materialSugerido: "PLA",
    precioImpresion: 260,
    licencia: "propio",
  },
  {
    id: "tope-puerta",
    nombre: "Tope de puerta",
    descripcion:
      "Cuña flexible que agarra en piso liso. No raya y no se desliza.",
    forma: "tope",
    medidas: "12.4 × 6.0 × 5.0 cm",
    materialSugerido: "TPU",
    precioImpresion: 210,
    licencia: "propio",
  },
  {
    id: "gancho-pared",
    nombre: "Gancho de pared",
    descripcion:
      "Se atornilla o se pega. Probado con 4 kg colgando sin deformarse.",
    forma: "gancho",
    medidas: "11.0 × 7.6 × 2.0 cm",
    materialSugerido: "PETG",
    precioImpresion: 195,
    licencia: "propio",
  },
  {
    id: "perilla-repuesto",
    nombre: "Perilla de repuesto",
    descripcion:
      "Para estufas y lavadoras cuyo refaccionario ya cerró. El eje se ajusta a tu medida.",
    forma: "perilla",
    medidas: "4.2 × 4.2 × 3.0 cm",
    materialSugerido: "PETG",
    precioImpresion: 180,
    licencia: "propio",
  },
];

/** ¿Hay algún modelo de un tercero publicado? Decide si se muestra el aviso. */
export const HAY_MODELOS_DE_TERCEROS = MODELOS.some(
  (m) => m.licencia !== "propio",
);
