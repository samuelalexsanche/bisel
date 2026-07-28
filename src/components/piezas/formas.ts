/**
 * Siluetas de piezas — dibujo técnico, NO fotografía.
 *
 * §13 prohíbe "renders 3D presentados como fotos de producto. Ni uno". Estas
 * formas son planos: contorno en Grafito y relleno de líneas de capa. Se leen
 * como lo que son, un dibujo, y por eso no compiten con la foto real cuando
 * llegue (§14.3). Tampoco hay engranes, robots ni circuitos (§13).
 *
 * Todas viven en un lienzo de 200 × 200 y se apoyan en la línea y = 150, que es
 * la cama de impresión.
 */
export type Forma = {
  d: string;
  /** Descripción honesta para lectores de pantalla: dice que es un dibujo. */
  alt: string;
  /** Trazos interiores: aristas y detalles que el contorno solo no cuenta. */
  detalle?: string;
};

export const FORMAS = {
  organizador: {
    alt: "Dibujo técnico de un organizador de escritorio con tres compartimentos",
    d: "M32 150 L32 74 L168 74 L168 150 Z",
    detalle: "M77 74 L77 150 M123 74 L123 150 M32 88 L168 88",
  },

  soporte: {
    alt: "Dibujo técnico de un soporte para audífonos, con base, columna y cuna",
    /* Base, columna y una cuna con los extremos levantados: así se entiende
       que la diadema descansa encima y no se resbala. */
    d: "M52 150 L52 133 L148 133 L148 150 Z M91 133 L91 78 L109 78 L109 133 Z M62 78 L62 50 L77 50 L77 65 L123 65 L123 50 L138 50 L138 78 Z",
    detalle: "M100 133 L100 78 M62 66 L138 66",
  },

  perilla: {
    alt: "Dibujo técnico de una perilla de repuesto con eje cuadrado",
    d: "M68 150 L68 96 C68 72 132 72 132 96 L132 150 Z",
    detalle: "M90 150 L90 128 L110 128 L110 150 M68 116 L132 116",
  },

  maceta: {
    alt: "Dibujo técnico de una maceta de paredes rectas",
    d: "M72 150 L58 72 L142 72 L128 150 Z",
    detalle: "M58 86 L142 86 M84 72 L84 150",
  },

  tope: {
    alt: "Dibujo técnico de un tope de puerta en cuña",
    d: "M40 150 L164 150 L164 128 L40 100 Z",
    detalle: "M40 128 L164 128 M120 128 L120 150",
  },

  gancho: {
    alt: "Dibujo técnico de un gancho de pared visto de lado",
    d: "M58 46 L78 46 L78 154 L58 154 Z M78 112 L134 112 L134 132 L78 132 Z M118 112 L134 112 L134 84 L118 84 Z",
    detalle: "M68 60 L68 140",
  },
} as const satisfies Record<string, Forma>;

export type NombreForma = keyof typeof FORMAS;
export const NOMBRES_FORMA = Object.keys(FORMAS) as NombreForma[];
