/* ============================================================================
   Calculadora de presupuesto — precios del taller (agosto 2026)

   Estimación orientativa, NO una cotización. Todo vive en el cliente: el
   sitio es estático y no hay servidor (§7.3). Las constantes de abajo son los
   costos y tarifas con los que se calcula; si cambia el costo del filamento o
   la tarifa del taller, se ajustan aquí y la calculadora entera los hereda.

   Los rangos publicados (§1 y llms.txt) son los anclajes:
   - Catálogo:           $180 – $450 MXN   (precio fijo por pieza)
   - Pieza a medida:     $350 – $1,800 MXN
   - Lote (50–200 pzas): $1,500 – $9,000 MXN

   La estimación nunca se muestra fuera de esos rangos: si el cálculo bruto
   queda fuera, se recorta al rango y se avisa. Prometer un precio fuera de lo
   publicado sería inventar (criterio 12) y la calculadora perdería la única
   ventaja que tiene sobre "escríbeme y te cotizo".
   ========================================================================= */

export type MaterialCalculadora = "PLA" | "PETG" | "TPU";
export type RellenoCalculadora = "ligero" | "normal" | "resistente";
export type ComplejidadCalculadora = "simple" | "media" | "compleja";
export type AcabadoCalculadora = "estandar" | "lijado" | "pintura";
export type TamanoLote = "pequena" | "mediana" | "grande";

/** Materiales — densidad (g/cm³), costo de filamento (MXN/kg) y velocidad de
 *  impresión (cm³/h). Edítame según el costo real de tu filamento. */
export const MATERIALES_CALCULADORA = [
  { valor: "PLA", etiqueta: "PLA", densidad: 1.24, costoKg: 450, cm3PorHora: 14 },
  {
    valor: "PETG",
    etiqueta: "PETG",
    densidad: 1.27,
    costoKg: 600,
    cm3PorHora: 12,
  },
  { valor: "TPU", etiqueta: "TPU", densidad: 1.21, costoKg: 800, cm3PorHora: 9 },
] as const;

/** Relleno → fracción efectiva de material (paredes + relleno). */
export const RELLENOS_CALCULADORA = [
  { valor: "ligero", etiqueta: "Ligero — 15%", factor: 0.25 },
  { valor: "normal", etiqueta: "Normal — 25%", factor: 0.35 },
  { valor: "resistente", etiqueta: "Resistente — 50%", factor: 0.55 },
] as const;

/** Complejidad → qué fracción de la caja (largo × ancho × alto) ocupa la pieza. */
export const COMPLEJIDADES_CALCULADORA = [
  { valor: "simple", etiqueta: "Simple — una caja o un bloque", factor: 0.3 },
  { valor: "media", etiqueta: "Media — detalles y curvas", factor: 0.45 },
  {
    valor: "compleja",
    etiqueta: "Compleja — piezas con huecos o muchas caras",
    factor: 0.65,
  },
] as const;

/** Acabado extra sobre el precio de impresión. */
export const ACABADOS_CALCULADORA = [
  { valor: "estandar", etiqueta: "Estándar — como sale de la impresora", extra: 0 },
  { valor: "lijado", etiqueta: "Lijado", extra: 80 },
  { valor: "pintura", etiqueta: "Lijado y pintura", extra: 150 },
] as const;

/** Tamaños de pieza típica para lotes. */
export const TAMANOS_LOTE = [
  { valor: "pequena", etiqueta: "Pequeña — llavero, favor, 2 a 5 cm", base: 30 },
  { valor: "mediana", etiqueta: "Mediana — 5 a 12 cm", base: 55 },
  { valor: "grande", etiqueta: "Grande — 12 a 20 cm", base: 90 },
] as const;

/** Límites reales del taller (mismos que llms.txt y /como-funciona). */
export const LIMITES_MEDIDA = { largo: 25, ancho: 21, alto: 21 } as const;

/** Rangos publicados. */
export const RANGO_MEDIDA = { min: 350, max: 1800 } as const;
export const RANGO_LOTE = { min: 1500, max: 9000 } as const;
export const RANGO_CATALOGO = { min: 180, max: 450 } as const;

/* Tarifas internas del taller — edítame con tus costos reales. */
export const TARIFA_HORA = 150; // MXN por hora de máquina + mano de obra
export const ARRANQUE = 60; // preparación de la impresora y cambio de filamento
export const MARGEN = 1.9; // sobre material + tiempo: cubre luz, desgaste y margen
export const COSTO_DISENO = 250; // solo si no trae archivo: modelar la pieza

export type ParametrosMedida = {
  largo: number;
  ancho: number;
  alto: number;
  material: MaterialCalculadora;
  relleno: RellenoCalculadora;
  complejidad: ComplejidadCalculadora;
  acabado: AcabadoCalculadora;
  cantidad: number;
  traeArchivo: boolean;
};

export type EstimacionMedida = {
  /** cm³ de la caja (largo × ancho × alto). */
  volumenCaja: number;
  /** cm³ de material que la impresora va a depositar. */
  volumenMaterial: number;
  gramos: number;
  horas: number;
  /** Costo bruto sin recortar al rango publicado. */
  costoBruto: number;
  precioMedio: number;
  precioMin: number;
  precioMax: number;
  sobreMaximo: boolean;
  bajoMinimo: boolean;
};

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function redondear(v: number, paso: number): number {
  return Math.round(v / paso) * paso;
}

/**
 * Estimación de una pieza a medida.
 *
 * Modelo: se calcula el volumen de material (caja × complejidad × relleno),
 * de ahí gramos y horas de impresión, y se suma material + tiempo de máquina
 * + arranque + diseño (solo si no trae archivo). Todo con un margen y se
 * redondea. El resultado se recorta al rango publicado.
 */
export function estimarMedida(p: ParametrosMedida): EstimacionMedida {
  const mat =
    MATERIALES_CALCULADORA.find((m) => m.valor === p.material) ??
    MATERIALES_CALCULADORA[0];
  const relleno =
    RELLENOS_CALCULADORA.find((r) => r.valor === p.relleno) ??
    RELLENOS_CALCULADORA[1];
  const complejidad =
    COMPLEJIDADES_CALCULADORA.find((c) => c.valor === p.complejidad) ??
    COMPLEJIDADES_CALCULADORA[1];
  const acabado =
    ACABADOS_CALCULADORA.find((a) => a.valor === p.acabado) ??
    ACABADOS_CALCULADORA[0];
  const cantidad = clamp(Math.round(p.cantidad) || 1, 1, 10);

  const volumenCaja =
    Math.max(0, p.largo) * Math.max(0, p.ancho) * Math.max(0, p.alto);
  const volumenMaterial = volumenCaja * complejidad.factor * relleno.factor;
  const gramos = volumenMaterial * mat.densidad;
  const horas = (volumenMaterial / mat.cm3PorHora) * cantidad;
  const costoMaterial = (gramos / 1000) * mat.costoKg * cantidad;
  const costoHoras = horas * TARIFA_HORA;
  const costoDiseno = p.traeArchivo ? 0 : COSTO_DISENO;
  const costoBruto =
    (costoMaterial + costoHoras + ARRANQUE + costoDiseno) * MARGEN +
    acabado.extra;

  const medio = redondear(costoBruto, 10);
  const min = redondear(costoBruto * 0.85, 10);
  const max = redondear(costoBruto * 1.2, 10);

  return {
    volumenCaja,
    volumenMaterial,
    gramos,
    horas,
    costoBruto,
    precioMedio: clamp(medio, RANGO_MEDIDA.min, RANGO_MEDIDA.max),
    precioMin: clamp(min, RANGO_MEDIDA.min, RANGO_MEDIDA.max),
    precioMax: clamp(max, RANGO_MEDIDA.min, RANGO_MEDIDA.max),
    sobreMaximo: medio > RANGO_MEDIDA.max,
    bajoMinimo: medio < RANGO_MEDIDA.min,
  };
}

export type ParametrosLote = {
  tamano: TamanoLote;
  cantidad: number;
};

export type EstimacionLote = {
  cantidad: number;
  precioTotal: number;
  porPieza: number;
  sobreMaximo: boolean;
};

/**
 * Estimación de un lote de 50 a 200 piezas.
 *
 * El precio por pieza baja con la cantidad: de 1.0 a 50 piezas hasta 0.55 a
 * 200, porque se amortiza el diseño y la preparación (lo mismo que dice el
 * blog de precios). Se recorta al rango publicado de lotes.
 */
export function estimarLote(p: ParametrosLote): EstimacionLote {
  const t = TAMANOS_LOTE.find((x) => x.valor === p.tamano) ?? TAMANOS_LOTE[0];
  const cantidad = clamp(Math.round(p.cantidad) || 50, 50, 200);
  const descuento = 1 - 0.45 * ((cantidad - 50) / 150);
  const bruto = t.base * cantidad * descuento;
  const total = redondear(bruto, 50);
  return {
    cantidad,
    precioTotal: clamp(total, RANGO_LOTE.min, RANGO_LOTE.max),
    porPieza: redondear(bruto / cantidad, 5),
    sobreMaximo: total > RANGO_LOTE.max,
  };
}
