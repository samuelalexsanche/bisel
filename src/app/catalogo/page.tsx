import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/JsonLd";
import { FondoFoto } from "@/components/layout/FondoFoto";
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
    <main id="contenido" className="relative">
      <FondoFoto nombre="catalogo" />
      <div className="contenido relative py-16">
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
                  {/* §5.5 pide que el hover enseñe la macro de textura de capa,
                      porque enseñar las capas genera confianza. Pero sustituir
                      la foto entera dejaba al comprador sin ver lo que compra
                      justo cuando está mirándolo. La banda resuelve las dos
                      cosas: enseña las capas SIN tapar la pieza. */}
                  <div className="relative aspect-square overflow-hidden border-b border-cemento">
                    <Strata
                      className="absolute inset-0"
                      intensidad={0.28}
                      separacion={10}
                    />

                    {/* La pieza se queda SIEMPRE a la vista. */}
                    <div className="absolute inset-0">
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

                    {/* Banda que sube desde abajo. Solo se anima `transform`
                        (§5.4.4) y con reduced-motion aparece sin desplazarse. */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] translate-y-full transition-transform duration-200 ease-[cubic-bezier(0.2,0,0,1)] group-hover:translate-y-0 motion-reduce:transition-none"
                    >
                      <div className="relative h-full border-t-2 border-grafito">
                        <TexturaCapas />
                        <span className="cifra absolute bottom-2 left-3 text-[0.625rem] tracking-wide text-grafito uppercase">
                          Textura de capa
                        </span>
                      </div>
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
                        <dt className="text-texto-secundario">
                          Precio estimado
                        </dt>
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
      </div>
    </main>
  );
}
