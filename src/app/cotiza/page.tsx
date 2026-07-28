import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { BRAND, url } from "@/lib/brand";
import { schemaMigas, schemaPreguntas } from "@/lib/schema";
import { FormularioCotizacion } from "./FormularioCotizacion";

export const metadata: Metadata = {
  title: "Cotiza tu pieza a medida",
  description: `Mándame una foto y las medidas y te contesto el mismo día con precio, material y fecha. Impresión 3D a medida en ${BRAND.city}. No cobro por cotizar.`,
  alternates: { canonical: url("/cotiza") },
};

/* §7.2 — "Qué no imprimo". Convierte mejor que un catálogo que promete todo,
   y son los límites reales del taller, con cifras y unidades (§9 regla 3). */
const NO_IMPRIMO = [
  "Piezas que aguanten más de 80 °C sostenidos",
  "Nada que vaya en un sistema de frenos o de suspensión",
  "Réplicas de piezas con marca registrada",
  "Piezas de más de 25 × 21 × 21 cm en una sola impresión",
];

const PASOS = [
  "Lo leo el mismo día. Si llega después de las 7 pm, al día siguiente por la mañana.",
  "Te contesto por WhatsApp con precio, material recomendado y fecha de entrega.",
  "Si no lo puedo hacer, te lo digo y te sugiero a dónde ir.",
];

export default function Cotiza() {
  return (
    <main id="contenido" className="contenido py-16">
      <JsonLd
        datos={[
          schemaPreguntas(),
          schemaMigas([{ nombre: "Cotiza tu pieza", href: "/cotiza" }]),
        ]}
      />

      <header className="max-w-3xl">
        <h1 className="font-titulo text-h1">Cotiza tu pieza</h1>
        <p className="medida mt-5 text-texto-secundario">
          Mándame una foto y las medidas de lo que necesitas. Te contesto el
          mismo día con precio, material recomendado y fecha de entrega.
        </p>
      </header>

      {/*
        Formulario a la izquierda, expectativas a la derecha.
        En móvil se apilan con las EXPECTATIVAS PRIMERO (§7.2): quien llega de
        Google decide en 30 segundos si esto es real, y eso se decide leyendo
        qué va a pasar, no viendo un campo de texto vacío.
        `order` invierte el orden visual sin tocar el orden del DOM, así que el
        recorrido por teclado y por lector de pantalla sigue siendo el mismo.
      */}
      <div className="mt-16 grid gap-16 lg:grid-cols-[1.15fr_1fr] lg:items-start">
        <div className="order-2 lg:order-1">
          <FormularioCotizacion />
        </div>

        <aside className="order-1 space-y-12 lg:order-2">
          <section aria-labelledby="que-pasa">
            <h2 id="que-pasa" className="font-titulo text-h3">
              Qué pasa cuando envías esto
            </h2>
            <ol className="mt-5 space-y-4">
              {PASOS.map((p, i) => (
                <li key={p} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="cifra flex h-8 w-8 shrink-0 items-center justify-center border border-texto-secundario text-detalle text-grafito"
                  >
                    {i + 1}
                  </span>
                  <span className="text-texto-secundario">{p}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 border-l-2 border-grafito pl-4 font-titulo font-semibold text-grafito">
              No cobro por cotizar y no hay compromiso.
            </p>
          </section>

          <section aria-labelledby="no-imprimo">
            <h2 id="no-imprimo" className="font-titulo text-h3">
              Qué no imprimo
            </h2>
            <ul className="mt-5 space-y-3">
              {NO_IMPRIMO.map((n) => (
                <li
                  key={n}
                  className="border-b border-cemento pb-3 text-texto-secundario last:border-0"
                >
                  {n}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-detalle text-texto-secundario">
              Si tu pieza cae en alguno de estos casos te lo digo de inmediato,
              no te dejo esperando.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
