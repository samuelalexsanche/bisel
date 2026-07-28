import type { Metadata } from "next";
import Link from "next/link";

import { Placeholder } from "@/components/brand/Placeholder";
import { PrintReveal } from "@/components/motion/PrintReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Strata } from "@/components/motion/Strata";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/JsonLd";
import { BRAND, url } from "@/lib/brand";
import { schemaMigas, schemaPreguntas, schemaServicios } from "@/lib/schema";
import { LIMITES, MATERIALES, PREGUNTAS, TIEMPOS } from "@/lib/datos";

export const metadata: Metadata = {
  title: "Cómo funciona un pedido",
  description:
    "Del boceto a la pieza en 3 a 5 días hábiles. Materiales, límites de tamaño y temperatura, tiempos por tipo de pedido y garantía por escrito.",
  alternates: { canonical: url("/como-funciona") },
};

const PASOS = [
  {
    titulo: "Me mandas la idea",
    texto:
      "Una foto de la pieza rota, un boceto en servilleta o unas medidas anotadas. Con eso arranco.",
  },
  {
    titulo: "Te paso precio y fecha",
    texto:
      "El mismo día. Incluye el material que recomiendo y por qué ese y no otro.",
  },
  {
    titulo: "La fabrico",
    texto:
      "La pieza se imprime capa por capa cuando la pides. Por eso puedo cambiarle las medidas hasta el último momento.",
  },
  {
    titulo: "Te llega",
    texto: "Reviso la pieza, la empaco y te paso la guía. Envío a todo México.",
  },
] as const;

export default function ComoFunciona() {
  return (
    <main id="contenido">
      <JsonLd
        datos={[
          schemaPreguntas(),
          ...schemaServicios(),
          schemaMigas([{ nombre: "Cómo funciona", href: "/como-funciona" }]),
        ]}
      />

      <div className="contenido py-16">
        <header className="max-w-3xl">
          <h1 className="font-titulo text-h1">Cómo funciona</h1>
          <p className="medida mt-5 text-texto-secundario">
            Un pedido a medida tarda de 3 a 5 días hábiles desde que aprobamos
            el diseño. Aquí está todo lo demás: materiales, límites reales,
            tiempos y qué pasa si algo sale mal.
          </p>
        </header>

        {/* Cuatro pasos con PrintReveal encadenado — §7.4. */}
        <ol className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {PASOS.map((p, i) => (
            <li key={p.titulo}>
              <PrintReveal>
                <div className="border border-cemento p-6">
                  <span className="cifra text-detalle text-texto-secundario">
                    Paso {i + 1}
                  </span>
                  <h2 className="mt-2 font-titulo text-h3">{p.titulo}</h2>
                  <p className="mt-3 text-detalle text-texto-secundario">
                    {p.texto}
                  </p>
                </div>
              </PrintReveal>
            </li>
          ))}
        </ol>
      </div>

      <Strata variante="separador" className="contenido" />

      {/* ───────── Tabla de materiales completa ───────── */}
      <section
        className="contenido bajo-fold py-20"
        aria-labelledby="materiales"
      >
        <Reveal>
          <h2 id="materiales" className="font-titulo text-h2">
            ¿Qué material le va a tu pieza?
          </h2>
          <p className="medida mt-4 text-texto-secundario">
            Tres materiales cubren casi todo. Si dudas, dime dónde va a estar la
            pieza y yo elijo.
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

      {/* ───────── Límites y tiempos ───────── */}
      <section className="contenido bajo-fold grid gap-16 py-10 md:grid-cols-2">
        <div>
          <h2 className="font-titulo text-h2">Límites reales</h2>
          <dl className="mt-8">
            {LIMITES.map((l) => (
              <div
                key={l.dato}
                className="flex justify-between gap-6 border-b border-cemento py-4"
              >
                <dt className="text-texto-secundario">{l.dato}</dt>
                <dd className="cifra shrink-0 text-right text-grafito">
                  {l.valor}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className="font-titulo text-h2">Tiempos por tipo de pedido</h2>
          <dl className="mt-8">
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
          <p className="mt-4 text-detalle text-texto-secundario">
            Son días hábiles y son rangos, no promesas de un solo número. Si
            algo se atrasa, te aviso antes de que te toque preguntar.
          </p>
        </div>
      </section>

      {/* ───────── Garantía por escrito ───────── */}
      <section className="contenido bajo-fold py-20" aria-labelledby="garantia">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
          <div className="border-2 border-grafito p-8">
            <h2 id="garantia" className="font-titulo text-h3">
              Si llega mal
            </h2>
            <p className="medida mt-4 text-texto-secundario">
              Si la pieza llega rota o no cumple las medidas que acordamos, la
              reimprimo sin costo. Mándame una foto dentro de los 7 días
              siguientes a que la recibas. Si el error fue mío, el envío de
              reposición también corre por mi cuenta.
            </p>
          </div>
          <div className="mx-auto w-full max-w-[220px]">
            <Placeholder
              etiqueta="Foto del empaque y la guía — pendiente §14.3"
              ratio="3 / 4"
            />
          </div>
        </div>
      </section>

      {/* ───────── Preguntas ───────── */}
      <section
        className="contenido bajo-fold py-20"
        aria-labelledby="preguntas"
      >
        <h2 id="preguntas" className="font-titulo text-h2">
          Preguntas que me hacen seguido
        </h2>

        <Accordion type="single" collapsible className="mt-8">
          {PREGUNTAS.map((p, i) => (
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

        <div className="mt-12">
          <Button asChild size="lg">
            <Link href="/cotiza">Cotizar mi pieza</Link>
          </Button>
          <p className="mt-4 text-detalle text-texto-secundario">
            El taller está en {BRAND.city}, {BRAND.state}, y envío a todo
            México.
          </p>
        </div>
      </section>
    </main>
  );
}
