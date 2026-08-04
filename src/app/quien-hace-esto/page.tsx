import type { Metadata } from "next";
import Link from "next/link";

import { Foto } from "@/components/brand/Foto";
import { TrustStrip } from "@/components/brand/TrustStrip";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/JsonLd";
import { FondoFoto } from "@/components/layout/FondoFoto";
import { BRAND, url, waLink } from "@/lib/brand";
import { schemaFundador, schemaMigas } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Quién hace esto",
  description: `Me llamo ${BRAND.founder}. Imprimo desde ${BRAND.city} y contesto yo los mensajes. Taller de impresión 3D con dirección, cara y nombre.`,
  alternates: { canonical: url("/quien-hace-esto") },
};

/**
 * §7.5 — el señalizador de confianza más barato y más potente del sitio.
 * Un taller anónimo es un taller sospechoso.
 */
export default function QuienHaceEsto() {
  return (
    <main id="contenido" className="relative">
      <FondoFoto nombre="quien-hace-esto" />
      <div className="contenido relative py-16">
        <JsonLd
          datos={[
            schemaFundador(),
            schemaMigas([
              { nombre: "Quién hace esto", href: "/quien-hace-esto" },
            ]),
          ]}
        />

        <div className="grid gap-16 lg:grid-cols-[1fr_0.8fr] lg:items-start">
          <div>
            <h1 className="font-titulo text-h1">Quién hace esto</h1>

            {/* En primera persona, sin corporativizar. */}
            <div className="medida mt-8 space-y-5 text-cuerpo">
              <p className="text-grafito">
                Me llamo {BRAND.founder}. Imprimo desde {BRAND.city} y contesto
                yo los mensajes.
              </p>
              <p className="text-texto-secundario">
                Empecé porque necesitaba una pieza que nadie fabricaba. Terminé
                fabricándola.
              </p>
              <p className="text-texto-secundario">
                No hay un equipo de atención ni un conmutador. Cuando escribes
                por WhatsApp te contesto yo, y si no puedo hacer tu pieza te lo
                digo en lugar de darle vueltas.
              </p>
            </div>

            <div className="mt-10 border-l-2 border-grafito pl-5">
              <p className="cifra text-detalle tracking-wide text-texto-secundario uppercase">
                Dónde está el taller
              </p>
              {/* Ubicación declarada — §7.5, §8.2. El NAP debe coincidir carácter
                por carácter con Google Business, Facebook e Instagram. */}
              <p className="mt-2 font-titulo text-h3 text-grafito">
                {BRAND.city}, {BRAND.state}
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <a
                  href={waLink(
                    `Hola ${BRAND.founder}, te escribo desde el sitio de ${BRAND.name}.`,
                  )}
                  target="_blank"
                  rel="noopener"
                >
                  Escribirme por WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
              </Button>
            </div>
          </div>

          {/* Foto real del espacio de trabajo. Desordenado está bien: es prueba
            de que existe. Nunca una foto de stock (§14). */}
          <div className="space-y-6">
            <Foto
              nombre="taller"
              alt="Rincón del taller: dos impresoras 3D de escritorio sobre un banco de madera, bobinas de filamento en un estante y herramientas de mano."
              ancho={1200}
              alto={1500}
              sizes="(min-width: 1024px) 34vw, 100vw"
            />
            <Foto
              nombre="fundador"
              alt={`${BRAND.founder}, en el banco de trabajo, midiendo una pieza impresa con un calibrador.`}
              ancho={1100}
              alto={1100}
              sizes="(min-width: 1024px) 34vw, 100vw"
            />
          </div>
        </div>

        <Reveal>
          <section className="bajo-fold mt-24">
            <TrustStrip />
          </section>
        </Reveal>

        <Reveal>
          <section className="bajo-fold mt-16 max-w-3xl">
            <h2 className="font-titulo text-h2">Somos nuevos y lo decimos</h2>
            <p className="medida mt-4 text-texto-secundario">
              No vas a encontrar aquí “+500 clientes satisfechos” ni reseñas de
              gente que no existe. El taller abrió hace poco. Las reseñas se van
              a publicar desde la primera venta, con nombre de quien las
              escribió.
            </p>
            <p className="medida mt-4 text-texto-secundario">
              Mientras tanto, lo que puedo ofrecerte es esto: precio y fecha por
              escrito antes de que pagues, y garantía por escrito si algo sale
              mal.
            </p>
            <div className="mt-8">
              <Button asChild variant="outline">
                <Link href="/como-funciona">Ver la garantía</Link>
              </Button>
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}
