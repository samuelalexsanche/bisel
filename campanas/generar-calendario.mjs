/**
 * Genera calendario-bisel.ics a partir de CAMPANAS.
 *
 *   node campanas/generar-calendario.mjs
 *
 * El .ics se importa a Google Calendar a mano (Configuración → Importar), así
 * que no hace falta OAuth ni dar acceso a la cuenta a nadie.
 *
 * La idea de fondo: las fechas de campaña NO se calculan desde el evento, se
 * calculan hacia atrás desde los tiempos de producción reales del §7.4.
 * Un lote de 50-200 piezas son 7-14 días hábiles más 2-5 de envío: si la
 * campaña arranca en la fecha, el pedido ya no llega.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/* Días HÁBILES de colchón por tipo de pedido, incluyendo envío.
   Salen de lib/datos.ts: producción máxima + envío máximo. */
const COLCHON = {
  lote: 14 + 5, // lote 50-200 piezas
  medida: 5 + 5, // pieza a medida
  catalogo: 2 + 5, // pieza de catálogo
};

/** n-ésimo día de la semana de un mes (0 = lunes). */
function nesimoDow(anio, mes, dow, n) {
  const d = new Date(Date.UTC(anio, mes - 1, 1));
  d.setUTCDate(1 + ((dow - ((d.getUTCDay() + 6) % 7) + 7) % 7) + (n - 1) * 7);
  return d;
}

/** Resta n días hábiles (sin contar sábado ni domingo). */
function habilesAntes(fecha, n) {
  const d = new Date(fecha);
  let quedan = n;
  while (quedan > 0) {
    d.setUTCDate(d.getUTCDate() - 1);
    const dow = d.getUTCDay();
    if (dow !== 0 && dow !== 6) quedan--;
  }
  return d;
}

const dias = (fecha, n) => {
  const d = new Date(fecha);
  d.setUTCDate(d.getUTCDate() + n);
  return d;
};

const iso = (d) => d.toISOString().slice(0, 10).replace(/-/g, "");

const U = (a, m, d) => new Date(Date.UTC(a, m - 1, d));

/**
 * Las campañas.
 * `persona` remite al §1: Ana (catálogo), Ricardo (refacción), Fernanda
 * (lotes para eventos), Don Julio (B2B local).
 */
export const CAMPANAS = [
  {
    nombre: "Regreso a clases",
    fecha: U(2026, 8, 24),
    persona: "Ana",
    tipo: "catalogo",
    vende: "Organizadores de escritorio, soportes para tablet, portalápices",
    angulo:
      "El escritorio de la casa vuelve a usarse. Piezas que ordenan cables y útiles.",
  },
  {
    nombre: "Día de Muertos",
    fecha: U(2026, 11, 2),
    persona: "Fernanda",
    tipo: "lote",
    vende: "Adornos de ofrenda, portavelas, letras y figuras a medida",
    angulo:
      "Decoración de altar personalizada con el nombre de quien se recuerda.",
  },
  {
    nombre: "Buen Fin",
    fecha: nesimoDow(2026, 11, 4, 3), // 3er viernes de noviembre (0 = lunes)
    persona: "Ana",
    tipo: "catalogo",
    vende: "Todo el catálogo con descuento por volumen",
    angulo:
      "El evento comercial más grande de México. CONFIRMAR la fecha oficial: la anuncia la Concanaco cada año.",
    fechaIncierta: true,
  },
  {
    nombre: "Navidad y posadas",
    fecha: U(2026, 12, 25),
    persona: "Fernanda",
    tipo: "lote",
    vende: "Adornos personalizados, recuerdos de posada, regalos de empresa",
    angulo:
      "Regalo de empresa con el logo del cliente. Don Julio también compra aquí.",
  },
  {
    nombre: "Día de Reyes",
    fecha: U(2027, 1, 6),
    persona: "Ana",
    tipo: "catalogo",
    vende: "Juguetes y figuras impresas, repuestos de juguetes rotos",
    angulo:
      "Enero es mes de cuesta: el ángulo es reparar el juguete, no comprar otro.",
  },
  {
    nombre: "San Valentín",
    fecha: U(2027, 2, 14),
    persona: "Ana",
    tipo: "medida",
    vende: "Objetos personalizados con nombre o fecha",
    angulo: "Pieza única a medida, no el peluche que vende todo el mundo.",
  },
  {
    nombre: "Día del Niño",
    fecha: U(2027, 4, 30),
    persona: "Fernanda",
    tipo: "lote",
    vende: "Recuerdos por lote para escuelas y fiestas infantiles",
    angulo: "Las escuelas compran por salón: 30 a 200 piezas iguales.",
  },
  {
    nombre: "Día de las Madres",
    fecha: U(2027, 5, 10),
    persona: "Ana",
    tipo: "medida",
    vende: "Macetas, portarretratos y objetos con nombre",
    angulo:
      "La fecha más fuerte del año en México después de Navidad. Empieza pronto.",
  },
  {
    nombre: "Día del Maestro",
    fecha: U(2027, 5, 15),
    persona: "Fernanda",
    tipo: "lote",
    vende: "Reconocimientos y detalles por lote para escuelas",
    angulo: "Cae 5 días después del 10 de mayo: se venden juntos, no separados.",
  },
  {
    nombre: "Día del Padre",
    fecha: nesimoDow(2027, 6, 6, 3), // 3er domingo de junio
    persona: "Ricardo",
    tipo: "catalogo",
    vende: "Organizadores de taller, soportes de herramienta, ganchos",
    angulo:
      "La única fecha donde Ricardo es el regalado y no el que arregla algo.",
  },
];

function ics(campanas) {
  const lineas = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Bisel//Calendario de campanas//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Bisel · Campañas",
    "X-WR-TIMEZONE:America/Mexico_City",
  ];

  const evento = (uid, inicio, titulo, desc) => {
    lineas.push(
      "BEGIN:VEVENT",
      `UID:${uid}@bisel3d.com`,
      `DTSTAMP:${iso(new Date())}T000000Z`,
      `DTSTART;VALUE=DATE:${iso(inicio)}`,
      `DTEND;VALUE=DATE:${iso(dias(inicio, 1))}`,
      `SUMMARY:${titulo}`,
      `DESCRIPTION:${desc.replace(/\n/g, "\\n").replace(/,/g, "\\,")}`,
      "END:VEVENT",
    );
  };

  for (const c of campanas) {
    const slug = c.nombre.toLowerCase().replace(/[^a-z]+/g, "-");
    const cierre = habilesAntes(c.fecha, COLCHON[c.tipo]);
    const arranque = dias(cierre, -14);

    evento(
      `${slug}-arranque`,
      arranque,
      `▶ Empieza a publicar: ${c.nombre}`,
      `Persona: ${c.persona}\nQué vender: ${c.vende}\nÁngulo: ${c.angulo}\n\nDos semanas de contenido antes de cerrar pedidos.`,
    );

    evento(
      `${slug}-cierre`,
      cierre,
      `⛔ Último día para pedidos: ${c.nombre}`,
      `Después de hoy la pieza YA NO LLEGA a tiempo.\nColchón: ${COLCHON[c.tipo]} días hábiles (producción + envío).\nA partir de mañana, decirlo claro en vez de aceptar el pedido.`,
    );

    evento(
      `${slug}-fecha`,
      c.fecha,
      `● ${c.nombre}`,
      c.fechaIncierta
        ? `${c.angulo}\n\nATENCIÓN: fecha estimada, hay que confirmarla.`
        : c.angulo,
    );
  }

  lineas.push("END:VCALENDAR");
  return lineas.join("\r\n");
}

const salida = join(
  dirname(fileURLToPath(import.meta.url)),
  "calendario-bisel.ics",
);
writeFileSync(salida, ics(CAMPANAS));
console.log(`✓ ${CAMPANAS.length} campañas → ${CAMPANAS.length * 3} eventos`);
console.log(`  ${salida}`);
