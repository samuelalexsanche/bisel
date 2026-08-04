import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/JsonLd";
import { FondoFoto } from "@/components/layout/FondoFoto";
import { Reveal } from "@/components/motion/Reveal";
import { Strata } from "@/components/motion/Strata";
import { Pieza } from "@/components/piezas/Pieza";
import { Button } from "@/components/ui/button";
import { BRAND, url } from "@/lib/brand";
import { LIMITES } from "@/lib/datos";
import { LICENCIAS, MODELOS } from "@/lib/modelos";
import { precioMXN } from "@/lib/productos";
import { schemaMigas } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Modelos para imprimir · el diseño es gratis",
  description: `Catálogo de modelos 3D listos para imprimir. El diseño no se cobra: solo pagas la impresión. Hecho en ${BRAND.city} con envío a todo México.`,
  alternates: { canonical: url("/modelos") },
};

const PASOS = [
  "Eliges un modelo de aquí abajo.",
  "Me dices material y color, o dejas que yo te recomiende.",
  "Te paso precio y fecha el mismo día. El diseño va en cero.",
];

export default function Modelos() {
  return (
    <main id="contenido" className="relative">
      <FondoFoto nombre="catalogo" />
      <div className="contenido relative py-16">
        <JsonLd
          datos={schemaMigas([{ nombre: "Modelos", href: "/modelos" }])}
        />

        <header className="max-w-3xl">
          <h1 className="font-titulo text-h1">El diseño es gratis</h1>
          <p className="medida mt-5 text-texto-secundario">
            Estos modelos ya están dibujados y no te cuesto nada por ellos. Lo
            único que cobro es imprimirlos: el material, la máquina y el tiempo.
          </p>
          <p className="medida mt-4 text-texto-secundario">
            Si ya tienes tu propio archivo, también lo imprimo. Y si no existe
            el modelo, lo dibujo.
          </p>
        </header>

        {/* Cómo funciona, en tres pasos y sin adornos */}
        <section className="mt-14" aria-labelledby="como">
          <h2 id="como" className="font-titulo text-h3">
            Cómo funciona
          </h2>
          <ol className="mt-5 grid gap-6 md:grid-cols-3">
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
        </section>

        {/* Los límites por delante: que nadie elija algo que no cabe */}
        <section
          className="mt-12 border-2 border-grafito p-6"
          aria-labelledby="limites"
        >
          <h2 id="limites" className="font-titulo text-h3">
            Antes de elegir
          </h2>
          <dl className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {LIMITES.slice(0, 4).map((l) => (
              <div
                key={l.dato}
                className="flex justify-between gap-4 border-b border-cemento py-2"
              >
                <dt className="text-detalle text-texto-secundario">{l.dato}</dt>
                <dd className="cifra shrink-0 text-detalle text-grafito">
                  {l.valor}
                </dd>
              </div>
            ))}
          </dl>
          <p className="medida mt-4 text-detalle text-texto-secundario">
            Si tu pieza no cabe en una sola impresión, la fabrico en partes y la
            ensamblo. Te lo digo antes de cobrarte, no después.
          </p>
        </section>

        {/* ── Los modelos ── */}
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MODELOS.map((m, i) => {
            const lic = LICENCIAS[m.licencia];
            return (
              <li key={m.id}>
                <Reveal delay={((i % 3) + 1) as 1 | 2 | 3}>
                  <article className="flex h-full flex-col border border-cemento bg-hueso">
                    <div className="relative overflow-hidden border-b border-cemento bg-grafito px-10 pt-8 pb-4">
                      <Strata
                        className="absolute inset-0"
                        oscuro
                        intensidad={0.45}
                        separacion={10}
                      />
                      <div className="relative">
                        <Pieza forma={m.forma} conCama invertido />
                      </div>
                    </div>

                    <div className="flex grow flex-col p-6">
                      <h2 className="font-titulo text-h3">{m.nombre}</h2>
                      <p className="mt-2 grow text-detalle text-texto-secundario">
                        {m.descripcion}
                      </p>

                      <dl className="mt-5 space-y-1 text-detalle">
                        <div className="flex justify-between gap-4 border-b border-cemento pb-1">
                          <dt className="text-texto-secundario">Medidas</dt>
                          <dd className="cifra text-grafito">{m.medidas}</dd>
                        </div>
                        <div className="flex justify-between gap-4 border-b border-cemento pb-1">
                          <dt className="text-texto-secundario">Diseño</dt>
                          <dd className="cifra text-grafito">Gratis</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-texto-secundario">
                            Impresión desde
                          </dt>
                          <dd className="cifra text-grafito">
                            {precioMXN(m.precioImpresion)}
                          </dd>
                        </div>
                      </dl>

                      {/* Crédito y licencia SIEMPRE visibles. Si el modelo es
                          de un tercero, aquí aparece de quién es y de dónde
                          salió: es la condición para poder publicarlo. */}
                      <p className="mt-4 border-t border-cemento pt-3 text-[0.6875rem] text-texto-secundario">
                        {lic.nombre}
                        {m.licencia === "propio" ? (
                          <> · {BRAND.name}</>
                        ) : (
                          <>
                            {" · "}
                            <a
                              href={m.urlOrigen}
                              target="_blank"
                              rel="noopener nofollow"
                              className="underline underline-offset-2 hover:text-grafito"
                            >
                              {m.autor}
                            </a>
                          </>
                        )}
                      </p>

                      <div className="mt-5">
                        <Button asChild className="w-full">
                          <Link
                            href={`/cotiza?tipo=modelo&modelo=${encodeURIComponent(m.nombre)}`}
                          >
                            Pedir impresión
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>

        {/* Nota honesta sobre por qué el catálogo es de diseños propios */}
        <aside
          role="note"
          className="mt-14 max-w-3xl border-l-2 border-grafito pl-5"
        >
          <h2 className="font-titulo text-h3">
            Por qué no ves modelos bajados de internet
          </h2>
          <p className="medida mt-3 text-texto-secundario">
            Buena parte de lo que se publica en los repositorios de modelos
            tiene licencia <span className="cifra">no comercial</span>: se puede
            descargar e imprimir para uno mismo, pero no cobrar por imprimirlo.
          </p>
          <p className="medida mt-3 text-texto-secundario">
            Por eso este catálogo arranca con diseños míos. Cuando sume modelos
            de otras personas, cada ficha va a decir de quién es y bajo qué
            licencia, y solo entran las que permiten uso comercial.
          </p>
          <p className="medida mt-3 text-texto-secundario">
            Si viste un modelo en otro lado y lo quieres impreso,{" "}
            <Link
              href="/cotiza?tipo=archivo"
              className="text-arcilla-oscura underline underline-offset-4 hover:text-grafito"
            >
              mándame el archivo
            </Link>{" "}
            y lo imprimo: ahí la licencia la traes tú.
          </p>
        </aside>
      </div>
    </main>
  );
}
