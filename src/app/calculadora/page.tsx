import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { FondoFoto } from "@/components/layout/FondoFoto";
import { BRAND, url } from "@/lib/brand";
import { schemaMigas } from "@/lib/schema";
import { RANGO_CATALOGO, RANGO_LOTE, RANGO_MEDIDA } from "@/lib/presupuesto";
import { precioMXN } from "@/lib/productos";
import { CalculadoraPresupuesto } from "./CalculadoraPresupuesto";

export const metadata: Metadata = {
  title: "Calculadora de presupuesto de impresión 3D",
  description: `Estima en segundos cuánto cuesta tu impresión 3D: pieza del catálogo (${precioMXN(
    RANGO_CATALOGO.min,
  )} a ${precioMXN(RANGO_CATALOGO.max)}), pieza a medida (${precioMXN(
    RANGO_MEDIDA.min,
  )} a ${precioMXN(RANGO_MEDIDA.max)}) o lote para evento (${precioMXN(
    RANGO_LOTE.min,
  )} a ${precioMXN(RANGO_LOTE.max)}). Impresión 3D en ${BRAND.city}.`,
  alternates: { canonical: url("/calculadora") },
};

/* Preguntas reales de quien busca precios. Alimentan el FAQ visible y el
   JSON-LD FAQPage (§8.3): los dos deben decir lo mismo. */
const FAQ = [
  {
    pregunta: "¿La calculadora de precios es exacta?",
    respuesta:
      "No promete un precio exacto: es una estimación en segundos basada en tamaño, material, relleno, acabado y cantidad. El precio real se confirma con una cotización, que es gratis y se responde el mismo día.",
  },
  {
    pregunta: "¿Cuánto cuesta imprimir una pieza en 3D?",
    respuesta: `Los precios de referencia son: pieza del catálogo de ${precioMXN(
      RANGO_CATALOGO.min,
    )} a ${precioMXN(
      RANGO_CATALOGO.max,
    )}; pieza a medida de ${precioMXN(RANGO_MEDIDA.min)} a ${precioMXN(
      RANGO_MEDIDA.max,
    )}; y lote de 50 a 200 piezas de ${precioMXN(RANGO_LOTE.min)} a ${precioMXN(
      RANGO_LOTE.max,
    )}. El precio exacto depende de las medidas reales de tu pieza.`,
  },
  {
    pregunta: "¿Qué incluye el precio de una pieza a medida?",
    respuesta:
      "Material, tiempo de impresión, preparación de la impresora y, si no traes tu archivo 3D, el diseño de la pieza. El envío a todo México se suma aparte y se confirma en la cotización.",
  },
  {
    pregunta: "¿Las piezas del catálogo tienen precio fijo?",
    respuesta:
      "Sí: las piezas del catálogo tienen precio publicado y no necesitan cotización. Se piden directo y se fabrican en 1 a 2 días hábiles. La cotización es para piezas a medida y lotes.",
  },
];

export default function Calculadora() {
  return (
    <main id="contenido" className="relative">
      <FondoFoto nombre="capas" />
      <div className="contenido relative py-16">
        <JsonLd
          datos={[
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQ.map((f) => ({
                "@type": "Question",
                name: f.pregunta,
                acceptedAnswer: { "@type": "Answer", text: f.respuesta },
              })),
            },
            schemaMigas([
              { nombre: "Calculadora de presupuesto", href: "/calculadora" },
            ]),
          ]}
        />

        <header className="max-w-3xl">
          <h1 className="font-titulo text-h1">
            Calculadora de presupuesto
          </h1>
          <p className="medida mt-5 text-texto-secundario">
            Dime qué pieza necesitas y te doy un estimado en segundos, con los
            precios publicados del taller. No es una cotización: el precio
            exacto se confirma gratis y se responde el mismo día.
          </p>
        </header>

        <div className="mt-16 grid gap-16 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          <div className="order-2 lg:order-1">
            <CalculadoraPresupuesto />
          </div>

          <aside className="order-1 space-y-12 lg:order-2">
            <section aria-labelledby="precios-publicados">
              <h2 id="precios-publicados" className="font-titulo text-h3">
                Precios publicados
              </h2>
              <dl className="mt-5 space-y-4 text-detalle">
                {[
                  {
                    dato: "Pieza del catálogo",
                    rango: `${precioMXN(RANGO_CATALOGO.min)} – ${precioMXN(
                      RANGO_CATALOGO.max,
                    )}`,
                  },
                  {
                    dato: "Pieza a medida",
                    rango: `${precioMXN(RANGO_MEDIDA.min)} – ${precioMXN(
                      RANGO_MEDIDA.max,
                    )}`,
                  },
                  {
                    dato: "Lote de 50 a 200 piezas",
                    rango: `${precioMXN(RANGO_LOTE.min)} – ${precioMXN(
                      RANGO_LOTE.max,
                    )}`,
                  },
                ].map((p) => (
                  <div
                    key={p.dato}
                    className="flex items-baseline justify-between gap-4 border-b border-cemento pb-3"
                  >
                    <dt className="text-texto-secundario">{p.dato}</dt>
                    <dd className="font-titulo font-semibold text-grafito">
                      {p.rango} MXN
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 border-l-2 border-grafito pl-4 font-titulo font-semibold text-grafito">
                El precio se congela en la cotización: no cambia después.
              </p>
            </section>

            <section aria-labelledby="que-mueve">
              <h2 id="que-mueve" className="font-titulo text-h3">
                Qué mueve el precio
              </h2>
              <ul className="mt-5 space-y-3">
                {[
                  "Tamaño: más centímetros, más material y más horas de impresión.",
                  "Material: el TPU es más caro y más lento que el PLA.",
                  "Relleno y complejidad: una pieza hueca gasta menos que una maciza.",
                  "Acabado: lijar o pintar suma trabajo manual.",
                  "Cantidad: en lotes, el precio por pieza baja.",
                ].map((n) => (
                  <li
                    key={n}
                    className="border-b border-cemento pb-3 text-texto-secundario last:border-0"
                  >
                    {n}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-detalle text-texto-secundario">
                La calculadora usa los rangos publicados y nunca estima fuera
                de ellos: si tu pieza queda por arriba, te lo dice y te invita
                a cotizar.
              </p>
            </section>
          </aside>
        </div>

        {/* FAQ visible — el mismo contenido que el JSON-LD FAQPage. */}
        <section
          aria-labelledby="preguntas"
          className="mt-20 max-w-3xl border-t border-cemento pt-12"
        >
          <h2 id="preguntas" className="font-titulo text-h3">
            Preguntas frecuentes sobre precios
          </h2>
          <div className="mt-6 space-y-0 divide-y divide-cemento border-y border-cemento">
            {FAQ.map((f) => (
              <details key={f.pregunta} className="group py-4">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-titulo font-semibold text-grafito [&::-webkit-details-marker]:hidden">
                  {f.pregunta}
                  <span
                    aria-hidden="true"
                    className="font-titulo text-cuerpo text-texto-secundario transition-transform duration-[120ms] group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-texto-secundario">{f.respuesta}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
