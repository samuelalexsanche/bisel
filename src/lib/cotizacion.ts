import type { RegisterOptions } from "react-hook-form";

/** §7.2 — uso previsto. Determina el material recomendado. */
export const USOS = [
  { valor: "interior", etiqueta: "Interior" },
  { valor: "exterior", etiqueta: "Exterior" },
  { valor: "carga", etiqueta: "Carga o esfuerzo" },
  { valor: "decorativo", etiqueta: "Decorativo" },
] as const;

export const PLAZOS = [
  { valor: "sin-prisa", etiqueta: "Sin prisa" },
  { valor: "esta-semana", etiqueta: "Esta semana" },
  { valor: "fecha-fija", etiqueta: "Tengo una fecha fija" },
] as const;

export const MAX_ARCHIVOS = 3;
export const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export type Cotizacion = {
  descripcion: string;
  medidas: string;
  uso: string;
  plazo: string;
  nombre: string;
  contacto: string;
};

export const esCorreoOTelefono = (v: string) =>
  /\S+@\S+\.\S+/.test(v) || /\d[\d\s()+-]{6,}/.test(v);

/**
 * Reglas de validación del CLIENTE — §7.2.
 *
 * Deliberadamente sin Zod. El esquema de Zod vive en `cotizacion.server.ts` y
 * solo lo ejecuta la acción de servidor: mandarlo al navegador costaba unos
 * 60 KB gzip en una página que ya carga react-hook-form, y la validación del
 * cliente es comodidad, no seguridad. La de verdad es la del servidor.
 *
 * Los mensajes son los mismos en ambos lados: español, sin jerga.
 */
export const REGLAS = {
  descripcion: {
    required: "Cuéntame un poco más: ¿qué es la pieza y para qué la ocupas?",
    minLength: {
      value: 15,
      message: "Cuéntame un poco más: ¿qué es la pieza y para qué la ocupas?",
    },
    maxLength: {
      value: 2000,
      message: "Quedó muy largo. Resúmelo en menos de 2000 caracteres.",
    },
  },
  medidas: {
    required: "Aunque sea aproximadas: largo, ancho y alto en centímetros.",
    minLength: {
      value: 2,
      message: "Aunque sea aproximadas: largo, ancho y alto en centímetros.",
    },
    maxLength: {
      value: 300,
      message: "Con las medidas principales basta.",
    },
  },
  uso: { required: "Dime dónde va a vivir la pieza." },
  plazo: { required: "Dime para cuándo la necesitas." },
  nombre: {
    required: "¿Cómo te llamo?",
    minLength: { value: 2, message: "¿Cómo te llamo?" },
    maxLength: {
      value: 120,
      message: "Ese nombre es más largo de lo que esperaba.",
    },
  },
  contacto: {
    required: "Déjame un WhatsApp o un correo para contestarte.",
    maxLength: {
      value: 160,
      message: "Revisa el dato de contacto, quedó muy largo.",
    },
    validate: (v: string) =>
      esCorreoOTelefono(v.trim()) ||
      "Escríbelo como correo (hola@correo.com) o como teléfono a 10 dígitos.",
  },
} satisfies Record<keyof Cotizacion, RegisterOptions<Cotizacion>>;
