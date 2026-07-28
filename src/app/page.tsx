import Link from "next/link";

import { Placeholder } from "@/components/brand/Placeholder";
import { TrustStrip } from "@/components/brand/TrustStrip";
import { DimensionLine } from "@/components/motion/DimensionLine";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { PrintReveal } from "@/components/motion/PrintReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Strata } from "@/components/motion/Strata";
import { Reviews } from "@/components/sections/Reviews";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/JsonLd";
import { BRAND, waLink } from "@/lib/brand";
import { schemaServicios } from "@/lib/schema";

/* Las tres líneas de negocio — §7.1 sección 3.
   Cada tarjeta le habla a una persona distinta del §1. */
const LINEAS = [
  {
    titulo: "Catálogo",
    texto:
      "Piezas ya diseñadas, listas para enviar. Organizadores, soportes, objetos para la casa.",
    href: "/catalogo",
    enlace: "Ver el catálogo",
  },
  {
    titulo: "Pieza a medida",
    texto:
      "Se rompió algo y ya no lo fabrican. Mándame una foto y las medidas.",
    href: "/cotiza",
    enlace: "Cotizar mi pieza",
  },
  {
    titulo: "Personalizados",
    texto: "Bodas, XV, eventos de empresa. Lotes de 50 a 200 piezas.",
    href: "/cotiza",
    enlace: "Pedir precio por lote",
  },
] as const;

/* §7.1 sección 6 — criterio técnico real. Es el arquetipo Sabio: educar genera
   confianza, y estas tres líneas responden la pregunta antes de explicarla (§9). */
const MATERIALES = [
  {
    nombre: "PLA",
    texto:
      "Rígido y económico. Para interiores. No lo uses en el coche: se deforma con el calor.",
  },
  {
    nombre: "PETG",
    texto: "Aguanta sol y humedad. Para exteriores y piezas que cargan peso.",
  },
  {
    nombre: "TPU",
    texto: "Flexible. Empaques, topes, piezas que amortiguan.",
  },
] as const;

export default function Inicio() {
  return (
    <main id="contenido">
      <JsonLd datos={schemaServicios()} />

      {/* ═══════════ 1 · Hero — promesa. Habla a todas. ═══════════ */}
      <section className="relative overflow-hidden">
        {/* Plano 0 · estratos */}
        <ParallaxLayer depth={0} className="absolute inset-0">
          <Strata className="h-full w-full" />
        </ParallaxLayer>

        <div className="contenido relative grid items-center gap-12 py-20 md:grid-cols-2 md:py-28">
          {/* Sin <Reveal> sobre el fold: su estado inicial es opacity:0 y
              retrasaría el LCP hasta que hidratara el JS (§6). */}
          <div>
            <p className="cifra text-detalle tracking-wide text-texto-secundario uppercase">
              {BRAND.city}, {BRAND.state}
            </p>

            <h1 className="mt-4 font-titulo text-h1">
              La pieza que no existía.
            </h1>

            <p className="medida mt-6 text-texto-secundario">
              Fabrico refacciones, organizadores y objetos a medida en{" "}
              {BRAND.city}. Si te lo puedes imaginar, existe el lunes.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/catalogo">Ver catálogo</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/cotiza">Cotizar mi pieza</Link>
              </Button>
            </div>
          </div>

          {/* La firma del sitio: la pieza construyéndose capa por capa. */}
          <PrintReveal>
            <Placeholder
              etiqueta="Foto de la pieza del héroe — pendiente §14.3"
              ratio="1 / 1"
            />
          </PrintReveal>
        </div>
      </section>

      {/* ═══════════ 2 · Producto en contexto ═══════════ */}
      <section
        className="contenido bajo-fold py-20"
        aria-labelledby="en-contexto"
      >
        <Reveal>
          <h2 id="en-contexto" className="font-titulo text-h2">
            Así se ve en la mano
          </h2>
          <p className="medida mt-4 text-texto-secundario">
            Nunca vas a ver una pieza flotando sin referencia de tamaño. Las
            medidas van sobre la foto porque comprar a ciegas termina en
            devolución.
          </p>
        </Reveal>

        <div className="relative mt-12 grid gap-10 md:grid-cols-[1fr_auto]">
          <div className="relative">
            {/* Foto de la pieza EN USO REAL: en la mano, en el cajón, montada. */}
            <Placeholder
              etiqueta="Pieza en uso real — en la mano o montada — pendiente §14.3"
              ratio="3 / 2"
            />

            {/* Plano 3 · cotas. Van más rápido que el contenido: se sienten
                por delante del objeto, como un acetato sobre la foto. */}
            <ParallaxLayer depth={3} className="mt-3">
              <DimensionLine medida="18.4 cm" />
            </ParallaxLayer>
          </div>

          <div className="hidden md:block">
            <DimensionLine medida="11.2 cm" orientacion="vertical" />
          </div>
        </div>
      </section>

      {/* ═══════════ 3 · Las tres líneas ═══════════ */}
      <section className="contenido bajo-fold py-20" aria-labelledby="lineas">
        <Reveal>
          <h2 id="lineas" className="font-titulo text-h2">
            Tres formas de pedir
          </h2>
        </Reveal>

        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {LINEAS.map((l, i) => (
            <li key={l.titulo}>
              {/* Borde de 1px en Cemento (§7.1). La tarjeta es un contenedor,
                  no un control: el control es el enlace de dentro, que sí lleva
                  contraste y foco propios (§4.1.1, consecuencia 2). */}
              <Reveal delay={(i + 1) as 1 | 2 | 3}>
                <article className="flex h-full flex-col border border-cemento p-8">
                  <h3 className="font-titulo text-h3">{l.titulo}</h3>
                  <p className="mt-3 grow text-texto-secundario">{l.texto}</p>
                  <p className="mt-6">
                    <Link
                      href={l.href}
                      className="inline-flex min-h-[44px] items-center font-titulo text-detalle font-semibold text-arcilla-oscura underline underline-offset-4 transition-colors duration-[120ms] hover:text-grafito"
                    >
                      {l.enlace}
                    </Link>
                  </p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* ═══════════ 4 · Franja de confianza ═══════════ */}
      <section className="contenido bajo-fold py-6">
        <TrustStrip />
      </section>

      {/* ═══════════ 5 · El proceso a la vista ═══════════ */}
      <section className="contenido bajo-fold py-20" aria-labelledby="proceso">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <h2 id="proceso" className="font-titulo text-h2">
              Esto es una impresora, no un catálogo de stock
            </h2>
            <p className="medida mt-4 text-texto-secundario">
              Cada pieza se fabrica cuando la pides. Por eso puedo cambiarle las
              medidas.
            </p>
          </Reveal>

          {/* Video vertical 9:16 del timelapse. Ruido de taller real, sin música.
              PENDIENTE §14.4 — mientras no exista, placeholder con la relación
              de aspecto correcta para que no haya salto de layout al montarlo.

              Cuando llegue: autoplay muted loop playsinline, con poster y
              preload="metadata", NUNCA preload="auto" (§7.1 sección 5). */}
          <div className="mx-auto w-full max-w-xs">
            <Placeholder
              etiqueta="Timelapse de impresión 9:16 — pendiente §14.4"
              ratio="9 / 16"
            />
          </div>
        </div>
      </section>

      {/* ═══════════ 6 · Materiales, en corto ═══════════ */}
      <section
        className="contenido bajo-fold py-20"
        aria-labelledby="materiales"
      >
        <Reveal>
          <h2 id="materiales" className="font-titulo text-h2">
            ¿Qué material le va a tu pieza?
          </h2>
          <p className="medida mt-4 text-texto-secundario">
            Tres opciones. Si no sabes cuál, dime para qué es y yo te la
            recomiendo.
          </p>
        </Reveal>

        <dl className="mt-10 grid gap-px border border-cemento bg-cemento md:grid-cols-3">
          {MATERIALES.map((m) => (
            <div key={m.nombre} className="bg-hueso p-8">
              <dt className="cifra text-h3 text-grafito">{m.nombre}</dt>
              <dd className="mt-3 text-texto-secundario">{m.texto}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ═══════════ 7 · Reseñas — solo si existen de verdad ═══════════ */}
      <Reviews />

      {/* ═══════════ 8 · CTA final ═══════════ */}
      {/* `data-acento="arcilla"` — mientras esta sección esté en viewport, el
          botón flotante de WhatsApp se oculta. Nunca dos Arcilla a la vez. */}
      <section
        data-acento="arcilla"
        className="sobre-grafito bajo-fold bg-grafito py-24 text-hueso"
        aria-labelledby="cta-final"
      >
        <div className="contenido">
          <h2 id="cta-final" className="font-titulo text-h2">
            ¿Tienes una pieza en la cabeza?
          </h2>
          {/* Cemento sobre Grafito = 9.72:1. El token `texto-secundario` daría
              1.99:1 aquí y no pasaría AA. */}
          <p className="medida mt-4 text-cemento">
            Mándame una foto o un boceto. Te contesto el mismo día con precio y
            fecha.
          </p>

          {/* Único elemento Arcilla de esta vista. Sobre Grafito, Arcilla da
              3.37:1: suficiente para un botón sólido con texto blanco encima —
              lo que se lee es el texto—, nunca para texto en Arcilla. */}
          <div className="mt-10">
            <Button asChild variant="accent" size="lg">
              <a
                href={waLink(
                  `Hola, tengo una pieza en la cabeza y quiero cotizarla con ${BRAND.name}.`,
                )}
                target="_blank"
                rel="noopener"
              >
                Cotizar por WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
