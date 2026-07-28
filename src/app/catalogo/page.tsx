import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/motion/Reveal";
import { Strata } from "@/components/motion/Strata";
import { Foto } from "@/components/brand/Foto";
import { Pieza } from "@/components/piezas/Pieza";
import { TexturaCapas } from "@/components/piezas/TexturaCapas";
import { Button } from "@/components/ui/button";
import { BRAND, url } from "@/lib/brand";
import { HAY_PRODUCTOS_REALES, PRODUCTOS, precioMXN } from "@/lib/productos";
import { schemaMigas } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Catálogo de piezas impresas en 3D",
  description: `Piezas ya diseñadas y listas para enviar a todo México. Organizadores, soportes y objetos para la casa, hechos en ${BRAND.city}.`,
  alternates: { canonical: url("/catalogo") },
};

export default function Catalogo() {
  return (
    <main id="contenido" className="contenido py-16">
      <JsonLd
        datos={schemaMigas([{ nombre: "Catálogo", href: "/catalogo" }])}
      />

      <header className="max-w-3xl">
        <h1 className="font-titulo text-h1">Catálogo</h1>
        <p className="medida mt-5 text-texto-secundario">
          Piezas ya diseñadas, listas para enviar a todo México. Cada una se
          imprime cuando la pides, así que puedo cambiarle las medidas si lo
          necesitas.
        </p>
      </header>

      {/* Aviso honesto mientras todo lo publicado sea de muestra (§13, criterio 12).
          Va antes de la rejilla, no escondido al final. */}
      {!HAY_PRODUCTOS_REALES && (
        <aside
          role="note"
          className="mt-10 border-2 border-grafito bg-arcilla-suave p-6"
        >
          <p className="font-titulo font-semibold text-grafito">
            Estas piezas todavía no están a la venta
          </p>
          <p className="medida mt-2 text-detalle text-grafito">
            El taller es nuevo y aún no hay inventario publicado. Lo de abajo
            son fichas de muestra para enseñar cómo se verá el catálogo: las
            medidas y los precios son estimados reales, pero todavía no puedes
            comprarlas. Lo que sí puedo hacer hoy es fabricarte una a medida.
          </p>
          <div className="mt-5">
            <Button asChild>
              <Link href="/cotiza">Cotizar mi pieza</Link>
            </Button>
          </div>
        </aside>
      )}

      <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTOS.map((p, i) => (
          <li key={p.id}>
            <Reveal delay={((i % 3) + 1) as 1 | 2 | 3}>
              <article className="group flex h-full flex-col border border-cemento">
                {/* En hover el dibujo cambia a la macro de la textura de capa:
                    enseñar las capas genera confianza, esconderlas la
                    destruye (§5.5). */}
                <div className="relative aspect-square overflow-hidden border-b border-cemento">
                  <Strata
                    className="absolute inset-0"
                    intensidad={0.28}
                    separacion={10}
                  />

                  <div className="absolute inset-0 transition-opacity duration-[120ms] group-hover:opacity-0">
                    {p.foto ? (
                      <Foto
                        nombre={`catalogo/${p.foto}`}
                        alt={`${p.nombre}. ${p.descripcion}`}
                        ancho={900}
                        alto={900}
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                        className="h-full w-full"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center p-10">
                        <Pieza forma={p.forma} conCama />
                      </div>
                    )}
                  </div>

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-0 transition-opacity duration-[120ms] group-hover:opacity-100"
                  >
                    <TexturaCapas />
                  </div>

                  {p.muestra && (
                    <span className="cifra absolute top-3 left-3 border border-grafito bg-hueso px-2 py-1 text-detalle text-grafito">
                      Muestra
                    </span>
                  )}
                </div>

                <div className="flex grow flex-col p-6">
                  <h2 className="font-titulo text-h3">{p.nombre}</h2>
                  <p className="mt-2 grow text-detalle text-texto-secundario">
                    {p.descripcion}
                  </p>

                  <dl className="mt-5 space-y-1 text-detalle">
                    <div className="flex justify-between gap-4 border-b border-cemento pb-1">
                      <dt className="text-texto-secundario">Medidas</dt>
                      <dd className="cifra text-grafito">{p.medidas}</dd>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-cemento pb-1">
                      <dt className="text-texto-secundario">Material</dt>
                      <dd className="cifra text-grafito">{p.material}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-texto-secundario">Precio estimado</dt>
                      <dd className="cifra text-grafito">
                        {precioMXN(p.precio)}
                      </dd>
                    </div>
                  </dl>

                  {/* Sin botón de compra mientras la ficha sea de muestra: no
                      puede existir un camino para pedir algo que no existe. */}
                  <div className="mt-6">
                    {p.muestra || !p.enlace ? (
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/cotiza">Pedirla a medida</Link>
                      </Button>
                    ) : (
                      <Button asChild className="w-full">
                        <a href={p.enlace} target="_blank" rel="noopener">
                          Comprar
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </main>
  );
}
