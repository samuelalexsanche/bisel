import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/JsonLd";
import { FondoFoto } from "@/components/layout/FondoFoto";
import { Reveal } from "@/components/motion/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BRAND, url } from "@/lib/brand";
import { MATERIALES, TIEMPOS } from "@/lib/datos";
import { schemaMigas, schemaServicios } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Servicio de impresión 3D en Guadalajara",
  description:
    "Servicio de impresión 3D en Guadalajara: piezas a medida, catálogo, lotes para eventos y prototipado. Precios publicados desde $180 MXN, envío a todo México y garantía por escrito.",
  alternates: { canonical: url("/servicios") },
};

/** Servicios con rango de precio real y destino (artículo o página). */
const SERVICIOS = [
  {
    titulo: "Piezas a medida",
    rango: "$350 – $1,800 MXN",
    texto:
      "Refacciones y piezas que ya no se fabrican, hechas a partir de una foto y unas medidas. De 3 a 5 días hábiles.",
    enlace: { href: "/blog/piezas-de-repuesto-impresion-3d", texto: "Guía de refacciones" },
  },
  {
    titulo: "Catálogo",
    rango: "$180 – $450 MXN",
    texto:
      "Piezas ya diseñadas y listas para enviar: organizadores, soportes y objetos para la casa. De 1 a 2 días hábiles.",
    enlace: { href: "/catalogo", texto: "Ver catálogo" },
  },
  {
    titulo: "Lotes para eventos y negocios",
    rango: "$1,500 – $9,000 MXN",
    texto:
      "Souvenirs, recuerdos y personalizados de 50 a 200 piezas para bodas, XV años y empresa. De 7 a 14 días hábiles.",
    enlace: { href: "/blog/impresion-3d-para-eventos", texto: "Souvenirs de eventos" },
  },
  {
    titulo: "Prototipado rápido",
    rango: "$350 – $1,800 MXN",
    texto:
      "De idea a pieza física en 3 a 5 días, sin moldes ni mínimos. Valida tu producto antes de invertir en producción.",
    enlace: { href: "/blog/prototipado-rapido", texto: "Guía de prototipado" },
  },
  {
    titulo: "Figuras personalizadas",
    rango: "$180 – $1,800 MXN",
    texto:
      "Figuras desde foto, articuladas, miniaturas y regalos personalizados. Sin réplicas con marca registrada.",
    enlace: { href: "/blog/figuras-personalizadas-3d", texto: "Guía de figuras" },
  },
  {
    titulo: "Maquetas arquitectónicas",
    rango: "$350 – $9,000 MXN",
    texto:
      "Maquetas volumétricas, de detalle y topográficas a partir de tu modelo digital. Para arquitectos y desarrolladores.",
    enlace: { href: "/blog/maquetas-arquitectonicas-impresion-3d", texto: "Guía de maquetas" },
  },
] as const;

/** Preguntas locales: zona metropolitana y pedido. */
const PREGUNTAS_SERVICIO = [
  {
    pregunta: "¿Hacen entregas en Zapopan, Tlaquepaque o Tonalá?",
    respuesta:
      "Sí: el taller está en Guadalajara y cubre toda la zona metropolitana (Zapopan, Tlaquepaque, Tonalá y Tlajomulco). También se puede coordinar entrega o envío por paquetería con guía de rastreo.",
  },
  {
    pregunta: "¿Cuánto cuesta el servicio de impresión 3D?",
    respuesta:
      "Precios publicados: catálogo de $180 a $450 MXN, piezas a medida de $350 a $1,800 MXN y lotes de $1,500 a $9,000 MXN. La cotización es gratis, se responde el mismo día y el precio se congela al aprobar.",
  },
  {
    pregunta: "¿Qué materiales imprimen?",
    respuesta:
      "PLA (interiores, hasta 55 °C), PETG (exteriores y carga, hasta 75 °C) y TPU (flexible, hasta 60 °C). El material se recomienda según el uso de la pieza, no según lo que haya en stock.",
  },
  {
    pregunta: "¿Cuánto tarda un pedido?",
    respuesta:
      "Catálogo: 1 a 2 días hábiles. Pieza a medida: 3 a 5 días hábiles. Lote de 50 a 200 piezas: 7 a 14 días hábiles. El envío nacional suma 2 a 5 días hábiles.",
  },
  {
    pregunta: "¿Cómo cotizo mi pieza?",
    respuesta:
      "Por el formulario de cotización o por WhatsApp con una foto y las medidas. Se responde el mismo día con precio, material recomendado y fecha; después de las 7 pm, a la mañana siguiente.",
  },
];

function schemaFaqServicio() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PREGUNTAS_SERVICIO.map((p) => ({
      "@type": "Question",
      name: p.pregunta,
      acceptedAnswer: { "@type": "Answer", text: p.respuesta },
    })),
  };
}

export default function Servicios() {
  return (
    <main id="contenido" className="relative">
      <FondoFoto nombre="catalogo" />
      <JsonLd
        datos={[
          ...schemaServicios(),
          schemaFaqServicio(),
          schemaMigas([{ nombre: "Servicios", href: "/servicios" }]),
        ]}
      />

      <div className="contenido py-16">
        <header className="max-w-3xl">
          <h1 className="font-titulo text-h1">
            Servicio de impresión 3D en Guadalajara
          </h1>
          <p className="medida mt-5 text-texto-secundario">
            Piezas a medida, catálogo, lotes para eventos y prototipado — con
            precios publicados desde $180 MXN, envío a todo México y garantía
            por escrito. Cotización gratis el mismo día.
          </p>
        </header>

        {/* ───────── Los 6 servicios ───────── */}
        <section className="mt-16" aria-labelledby="servicios">
          <h2 id="servicios" className="sr-only">
            Servicios
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICIOS.map((s) => (
              <li key={s.titulo}>
                <div className="flex h-full flex-col border border-cemento p-6">
                  <h3 className="font-titulo text-h3">{s.titulo}</h3>
                  <p className="cifra mt-2 text-detalle text-arcilla-oscura">
                    {s.rango}
                  </p>
                  <p className="mt-3 text-detalle text-texto-secundario">
                    {s.texto}
                  </p>
                  <Link
                    href={s.enlace.href}
                    className="mt-auto pt-4 text-detalle text-arcilla-oscura underline underline-offset-4 hover:text-grafito"
                  >
                    {s.enlace.texto}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* ───────── Zona de cobertura local ───────── */}
      <section
        className="contenido bajo-fold border-t border-cemento py-20"
        aria-labelledby="cobertura"
      >
        <Reveal>
          <h2 id="cobertura" className="font-titulo text-h2">
            Taller local en la Zona Metropolitana de Guadalajara
          </h2>
          <p className="medida mt-4 text-texto-secundario">
            El taller está en {BRAND.city}, {BRAND.state}, y cubre toda la zona
            metropolitana: Zapopan, Tlaquepaque, Tonalá y Tlajomulco. El envío
            por paquetería llega a cualquier punto de México con guía de
            rastreo, y las piezas viajan con garantía por escrito: si llegan
            rotas o mal medidas, se reimprimen sin costo.
          </p>
        </Reveal>
      </section>

      {/* ───────── Tabla de materiales ───────── */}
      <section className="contenido bajo-fold py-10" aria-labelledby="materiales">
        <Reveal>
          <h2 id="materiales" className="font-titulo text-h2">
            Materiales disponibles
          </h2>
          <p className="medida mt-4 text-texto-secundario">
            Tres materiales cubren casi todo. Si dudas, dime dónde va a estar
            la pieza y yo elijo.
          </p>
        </Reveal>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <caption className="sr-only">
              Comparación de materiales: temperatura máxima, uso en exteriores,
              rigidez y aplicaciones.
            </caption>
            <thead>
              <tr className="border-b-2 border-grafito">
                {["Material", "Aguanta", "Exterior", "Rigidez", "Para qué"].map(
                  (h) => (
                    <th
                      key={h}
                      scope="col"
                      className="py-3 pr-6 font-titulo text-detalle font-semibold text-grafito"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {MATERIALES.map((m) => (
                <tr key={m.nombre} className="border-b border-cemento">
                  <th scope="row" className="py-4 pr-6 align-top">
                    <span className="cifra text-h3 text-grafito">
                      {m.nombre}
                    </span>
                    <span className="mt-1 block text-detalle font-normal text-texto-secundario">
                      {m.resumen}
                    </span>
                  </th>
                  <td className="cifra py-4 pr-6 align-top text-detalle">
                    {m.temperatura}
                  </td>
                  <td className="py-4 pr-6 align-top text-detalle">
                    {m.exterior}
                  </td>
                  <td className="py-4 pr-6 align-top text-detalle text-texto-secundario">
                    {m.rigidez}
                  </td>
                  <td className="py-4 align-top text-detalle text-texto-secundario">
                    {m.usos}
                    <span className="mt-1 block text-grafito">
                      {m.advertencia}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ───────── Tiempos ───────── */}
      <section className="contenido bajo-fold py-10" aria-labelledby="tiempos">
        <h2 id="tiempos" className="font-titulo text-h2">
          Tiempos por tipo de pedido
        </h2>
        <dl className="mt-8 max-w-2xl">
          {TIEMPOS.map((t) => (
            <div
              key={t.pedido}
              className="flex justify-between gap-6 border-b border-cemento py-4"
            >
              <dt className="text-texto-secundario">{t.pedido}</dt>
              <dd className="cifra shrink-0 text-right text-grafito">
                {t.tiempo}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ───────── Preguntas ───────── */}
      <section className="contenido bajo-fold py-20" aria-labelledby="preguntas">
        <h2 id="preguntas" className="font-titulo text-h2">
          Preguntas frecuentes del servicio
        </h2>

        <Accordion type="single" collapsible className="mt-8">
          {PREGUNTAS_SERVICIO.map((p, i) => (
            <AccordionItem
              key={p.pregunta}
              value={`p-${i}`}
              className="border-b border-cemento"
            >
              <AccordionTrigger className="min-h-[44px] py-5 font-titulo text-h3 hover:no-underline">
                {p.pregunta}
              </AccordionTrigger>
              <AccordionContent className="medida pb-6 text-cuerpo text-texto-secundario">
                {p.respuesta}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Button asChild size="lg">
            <Link href="/cotiza">Cotizar mi pieza</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/calculadora">Estimar con la calculadora</Link>
          </Button>
        </div>
        <p className="mt-4 text-detalle text-texto-secundario">
          El taller está en {BRAND.city}, {BRAND.state}, y envío a todo México.
        </p>
      </section>
    </main>
  );
}
