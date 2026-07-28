/**
 * Bloque de datos verificables — §9.
 *
 * Es el contenido con más probabilidad de ser citado por un motor generativo,
 * porque es información concreta que casi ningún taller publica. Toda cifra
 * lleva unidad y contexto (§9 regla 3): "62 gramos, aguanta 4 kg", nunca
 * "resistente y ligero".
 */

export const MATERIALES = [
  {
    nombre: "PLA",
    resumen: "Rígido y económico. Para interiores.",
    temperatura: "Hasta 55 °C",
    exterior: "No",
    rigidez: "Alta, poco flexible",
    usos: "Organizadores, soportes, figuras, prototipos",
    advertencia: "No lo uses en el coche: se deforma con el calor.",
  },
  {
    nombre: "PETG",
    resumen: "Aguanta sol y humedad. Para exteriores y carga.",
    temperatura: "Hasta 75 °C",
    exterior: "Sí",
    rigidez: "Alta, con algo de tenacidad",
    usos: "Piezas que cargan peso, macetas, soportes a la intemperie",
    advertencia: "Es el material por defecto si la pieza va a sufrir.",
  },
  {
    nombre: "TPU",
    resumen: "Flexible. Amortigua y sella.",
    temperatura: "Hasta 60 °C",
    exterior: "Sí",
    rigidez: "Flexible, tipo goma",
    usos: "Empaques, topes, protectores, piezas que amortiguan",
    advertencia: "No sirve para piezas que deban mantener su forma bajo carga.",
  },
] as const;

/** Límites reales del taller. Publicarlos evita cotizaciones imposibles. */
export const LIMITES = [
  { dato: "Volumen máximo en una sola impresión", valor: "25 × 21 × 21 cm" },
  { dato: "Tolerancia habitual", valor: "± 0.2 mm" },
  { dato: "Altura de capa", valor: "0.12 a 0.28 mm" },
  { dato: "Temperatura sostenida máxima", valor: "80 °C, según material" },
  { dato: "Piezas más grandes", valor: "Se fabrican en partes y se ensamblan" },
] as const;

/** Tiempos siempre en rango explícito — nunca "entrega rápida" (§7.4). */
export const TIEMPOS = [
  { pedido: "Pieza del catálogo", tiempo: "1 a 2 días hábiles" },
  { pedido: "Pieza a medida", tiempo: "3 a 5 días hábiles" },
  { pedido: "Lote de 50 a 200 piezas", tiempo: "7 a 14 días hábiles" },
  { pedido: "Envío nacional", tiempo: "2 a 5 días hábiles adicionales" },
] as const;

/**
 * Preguntas en la forma en que la gente las busca y las pregunta (§9 regla 5).
 * Alimenta también el schema FAQPage (§8.3).
 */
export const PREGUNTAS = [
  {
    pregunta: "¿Cuánto tarda una pieza a medida?",
    respuesta:
      "De 3 a 5 días hábiles desde que aprobamos el diseño. Si la pieza es grande o va en lote, de 7 a 14 días hábiles. El envío nacional suma de 2 a 5 días hábiles.",
  },
  {
    pregunta: "¿Cuánto cuesta imprimir una pieza en 3D?",
    respuesta:
      "Depende del tamaño, el material y la cantidad. Una refacción chica suele ir de $350 a $1,800 MXN. Cotizar no cuesta y no compromete a nada.",
  },
  {
    pregunta: "¿Qué tan grande puede ser la pieza?",
    respuesta:
      "Hasta 25 × 21 × 21 cm en una sola impresión. Si es más grande, la fabrico en partes y la ensamblo.",
  },
  {
    pregunta: "¿Aguanta el calor del coche?",
    respuesta:
      "El PLA no: se deforma cerca de los 55 °C y un tablero al sol pasa de eso. Para el coche uso PETG, que aguanta hasta unos 75 °C.",
  },
  {
    pregunta: "¿Qué pasa si la pieza llega mal?",
    respuesta:
      "La reimprimo sin costo. Mándame una foto dentro de los 7 días siguientes a que la recibas. Si el error fue mío, el envío de reposición también corre por mi cuenta.",
  },
  {
    pregunta: "¿Hacen envíos a todo México?",
    respuesta:
      "Sí. El taller está en Guadalajara, Jalisco, y envío a todo el país.",
  },
] as const;
