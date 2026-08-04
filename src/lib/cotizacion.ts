import type { RegisterOptions } from "react-hook-form";

/* ============================================================================
   Cotización — §7.2

   El formulario se ramifica por TIPO DE PEDIDO: cada rama pide solo lo que
   hace falta para cotizar ese caso. Pedirle las medidas a quien compra del
   catálogo es ruido, y no pedírselas a quien encarga una refacción es
   quedarse sin poder cotizar.

   Todo vive en el cliente: el sitio es estático y no hay servidor (§7.3 —
   "este sitio no procesa pagos"). Deliberadamente sin Zod: react-hook-form ya
   valida y Zod costaba ~60 KB gzip en una página que no lo necesita.
   ========================================================================= */

export const TIPOS_PEDIDO = [
  {
    valor: "catalogo",
    etiqueta: "Una pieza del catálogo",
    ayuda: "Ya está diseñada, solo dime cuál y en qué color.",
  },
  {
    valor: "modelo",
    etiqueta: "Un modelo del catálogo de modelos",
    ayuda: "El diseño es gratis; cobro la impresión.",
  },
  {
    valor: "archivo",
    etiqueta: "Tengo mi propio archivo 3D",
    ayuda: "Tú traes el STL o el 3MF y yo lo imprimo.",
  },
  {
    valor: "medida",
    etiqueta: "No tengo modelo, la necesito a medida",
    ayuda: "Se rompió algo y ya no lo fabrican. Yo lo diseño.",
  },
  {
    valor: "lote",
    etiqueta: "Un lote para un evento o empresa",
    ayuda: "De 50 a 200 piezas para bodas, XV o eventos de empresa.",
  },
] as const;

export type TipoPedido = (typeof TIPOS_PEDIDO)[number]["valor"];

export const MATERIALES = [
  { valor: "PLA", etiqueta: "PLA — interiores, rígido" },
  { valor: "PETG", etiqueta: "PETG — exteriores y carga" },
  { valor: "TPU", etiqueta: "TPU — flexible" },
  { valor: "no-se", etiqueta: "No sé, recomiéndame" },
] as const;

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

export const RELLENOS = [
  { valor: "ligero", etiqueta: "Ligero — decorativo, 15%" },
  { valor: "normal", etiqueta: "Normal — uso diario, 25%" },
  { valor: "resistente", etiqueta: "Resistente — aguanta esfuerzo, 50%" },
] as const;

/* ============================================================================
   Plazos reales — la misma fuente que /como-funciona y el calendario
   de campañas. Son días HÁBILES e incluyen el envío.
   ========================================================================= */
export const COLCHON_HABILES: Record<TipoPedido, number> = {
  catalogo: 2 + 5,
  modelo: 3 + 5,
  archivo: 3 + 5,
  medida: 5 + 5,
  lote: 14 + 5,
};

/** Días hábiles entre hoy y una fecha. Negativo si ya pasó. */
export function habilesHasta(fecha: Date, desde = new Date()): number {
  const a = new Date(desde);
  a.setHours(0, 0, 0, 0);
  const b = new Date(fecha);
  b.setHours(0, 0, 0, 0);
  if (b <= a) return 0;

  let dias = 0;
  const cursor = new Date(a);
  while (cursor < b) {
    cursor.setDate(cursor.getDate() + 1);
    const dow = cursor.getDay();
    if (dow !== 0 && dow !== 6) dias++;
  }
  return dias;
}

/**
 * ¿Da tiempo a que llegue para esa fecha?
 *
 * Es la promesa del §7.4 aplicada ANTES de aceptar el pedido. Si no da tiempo
 * se dice en el momento, no cuando ya es tarde: "si no lo puedo hacer, te lo
 * digo y te sugiero a dónde ir".
 */
export function alcanzaLaFecha(
  tipo: TipoPedido,
  fechaISO: string,
): { alcanza: boolean; disponibles: number; necesarios: number } | null {
  if (!fechaISO) return null;
  const fecha = new Date(`${fechaISO}T12:00:00`);
  if (Number.isNaN(fecha.getTime())) return null;

  const disponibles = habilesHasta(fecha);
  const necesarios = COLCHON_HABILES[tipo];
  return { alcanza: disponibles >= necesarios, disponibles, necesarios };
}

/* ============================================================================
   Forma de los datos
   ========================================================================= */
export type Cotizacion = {
  tipo: TipoPedido;

  // Comunes a todas las ramas
  nombre: string;
  contacto: string;

  // catalogo
  producto?: string;
  color?: string;

  // modelo
  modelo?: string;
  escala?: string;

  // catalogo · modelo · archivo · lote
  cantidad?: string;

  // modelo · archivo
  material?: string;

  // archivo
  relleno?: string;
  acabado?: string;

  // medida
  descripcion?: string;
  medidas?: string;
  uso?: string;

  // lote
  fechaEvento?: string;
  personalizacion?: string;

  // medida · archivo
  plazo?: string;
};

/** Qué campos muestra cada rama. Manda el formulario y también el correo. */
export const CAMPOS_POR_TIPO: Record<TipoPedido, (keyof Cotizacion)[]> = {
  catalogo: ["producto", "color", "cantidad"],
  modelo: ["modelo", "material", "color", "escala", "cantidad"],
  archivo: ["material", "relleno", "acabado", "cantidad", "plazo"],
  medida: ["descripcion", "medidas", "uso", "plazo"],
  lote: ["cantidad", "fechaEvento", "personalizacion"],
};

export const esCorreoOTelefono = (v: string) =>
  /\S+@\S+\.\S+/.test(v) || /\d[\d\s()+-]{6,}/.test(v);

/**
 * Reglas de validación. Mensajes en español y sin jerga: quien llena esto no
 * sabe qué es un "campo requerido", sabe que le falta poner su nombre.
 */
export const REGLAS: Partial<
  Record<keyof Cotizacion, RegisterOptions<Cotizacion>>
> = {
  nombre: {
    required: "¿Cómo te llamo?",
    maxLength: {
      value: 120,
      message: "Ese nombre es más largo de lo esperado.",
    },
  },
  contacto: {
    required: "Déjame un WhatsApp o un correo para contestarte.",
    maxLength: { value: 160, message: "Revisa el dato, quedó muy largo." },
    validate: (v?: string) =>
      esCorreoOTelefono((v ?? "").trim()) ||
      "Escríbelo como correo (hola@correo.com) o como teléfono a 10 dígitos.",
  },
  producto: { required: "¿Cuál de las piezas te interesa?" },
  color: {},
  modelo: { required: "Dime cuál modelo o pégame su enlace." },
  escala: {},
  cantidad: {
    required: "¿Cuántas piezas necesitas?",
    validate: (v?: string) =>
      (Number(v) > 0 && Number(v) <= 500) ||
      "Pon un número entre 1 y 500. Para más, escríbeme y lo vemos.",
  },
  material: { required: "Elige material, o dime que te lo recomiende." },
  relleno: { required: "¿Qué tan resistente la necesitas?" },
  acabado: {},
  descripcion: {
    required: "Cuéntame un poco más: ¿qué es la pieza y para qué la ocupas?",
    minLength: {
      value: 15,
      message: "Cuéntame un poco más: ¿qué es y para qué la ocupas?",
    },
    maxLength: {
      value: 2000,
      message: "Resúmelo en menos de 2000 caracteres.",
    },
  },
  medidas: {
    required: "Aunque sea aproximadas: largo, ancho y alto en centímetros.",
    maxLength: { value: 300, message: "Con las medidas principales basta." },
  },
  uso: { required: "Dime dónde va a vivir la pieza." },
  plazo: { required: "Dime para cuándo la necesitas." },
  fechaEvento: { required: "¿Qué día es el evento?" },
  personalizacion: {},
} satisfies Partial<Record<keyof Cotizacion, RegisterOptions<Cotizacion>>>;
