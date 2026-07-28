import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Placeholder } from "@/components/brand/Placeholder";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/JsonLd";
import { BRAND, url } from "@/lib/brand";
import { schemaMigas } from "@/lib/schema";
import { PRODUCTOS, precioMXN } from "@/lib/productos";

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

      {PRODUCTOS.length === 0 ? (
        /* Estado vacío honesto — §7.3. Nunca productos de relleno. */
        <section className="mt-16 border-2 border-grafito p-10">
          <h2 className="font-titulo text-h3">
            Todavía no hay piezas publicadas
          </h2>
          <p className="medida mt-4 text-texto-secundario">
            El taller es nuevo y prefiero publicar una pieza cuando ya la
            fabriqué, la medí y le puse precio, en lugar de llenar esta página
            de fotos que no corresponden a nada.
          </p>
          <p className="medida mt-4 text-texto-secundario">
            Mientras tanto, lo que sí puedo hacer hoy es fabricarte una a
            medida. Mándame una foto y las medidas y te contesto el mismo día.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/cotiza">Cotizar mi pieza</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/como-funciona">Ver cómo funciona</Link>
            </Button>
          </div>
        </section>
      ) : (
        <ul className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTOS.map((p, i) => (
            <li key={p.id}>
              <Reveal delay={((i % 3) + 1) as 1 | 2 | 3}>
                <article className="flex h-full flex-col border border-cemento">
                  {/* En hover la foto principal cambia a la macro de la textura
                      de capa: enseñar las capas genera confianza, esconderlas
                      la destruye (§5.5). */}
                  <div className="group relative aspect-square overflow-hidden bg-blanco">
                    {p.foto ? (
                      <>
                        <Image
                          src={p.foto}
                          alt={`${p.nombre}. ${p.descripcion}`}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-opacity duration-[120ms] group-hover:opacity-0"
                        />
                        {p.fotoCapas && (
                          <Image
                            src={p.fotoCapas}
                            alt=""
                            aria-hidden="true"
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover opacity-0 transition-opacity duration-[120ms] group-hover:opacity-100"
                          />
                        )}
                      </>
                    ) : (
                      <Placeholder
                        etiqueta={`Foto de ${p.nombre} — pendiente §14.3`}
                        ratio="1 / 1"
                      />
                    )}
                  </div>

                  <div className="flex grow flex-col p-6">
                    <h2 className="font-titulo text-h3">{p.nombre}</h2>
                    <p className="mt-2 grow text-detalle text-texto-secundario">
                      {p.descripcion}
                    </p>

                    <dl className="mt-4 space-y-1 text-detalle">
                      <div className="flex justify-between gap-4">
                        <dt className="text-texto-secundario">Medidas</dt>
                        <dd className="cifra text-grafito">{p.medidas}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-texto-secundario">Material</dt>
                        <dd className="cifra text-grafito">{p.material}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-texto-secundario">Precio</dt>
                        <dd className="cifra text-grafito">
                          {precioMXN(p.precio)}
                        </dd>
                      </div>
                    </dl>

                    {/* Este sitio no procesa pagos: la ficha enlaza a la tienda. */}
                    <div className="mt-6">
                      <Button asChild className="w-full">
                        <a href={p.enlace} target="_blank" rel="noopener">
                          Comprar
                        </a>
                      </Button>
                    </div>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
