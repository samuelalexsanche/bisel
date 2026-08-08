import Link from "next/link";

import { JsonLd } from "@/components/JsonLd";
import { Foto } from "@/components/brand/Foto";
import { TrustStrip } from "@/components/brand/TrustStrip";
import { Seccion } from "@/components/layout/Seccion";
import { DimensionLine } from "@/components/motion/DimensionLine";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { PrintReveal } from "@/components/motion/PrintReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Strata } from "@/components/motion/Strata";
import { Pieza } from "@/components/piezas/Pieza";
import { Trayectoria } from "@/components/piezas/Trayectoria";
import { TexturaCapas } from "@/components/piezas/TexturaCapas";
import { Reviews } from "@/components/sections/Reviews";
import { Button } from "@/components/ui/button";
import { BRAND, waLink } from "@/lib/brand";
import { medio } from "@/lib/rutas";
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
    forma: "organizador",
  },
  {
    titulo: "Pieza a medida",
    texto:
      "Se rompió algo y ya no lo fabrican. Mándame una foto y las medidas.",
    href: "/cotiza",
    enlace: "Cotizar mi pieza",
    forma: "perilla",
  },
  {
    titulo: "Personalizados",
    texto: "Bodas, XV, eventos de empresa. Lotes de 50 a 200 piezas.",
    href: "/cotiza",
    enlace: "Pedir precio por lote",
    forma: "gancho",
  },
] as const;

/* §7.1 sección 6 — criterio técnico real. Es el arquetipo Sabio: educar genera
   confianza, y estas tres líneas responden la pregunta antes de explicarla (§9). */
const MATERIALES = [
  {
    nombre: "PLA",
    aguanta: "55 °C",
    texto:
      "Rígido y económico. Para interiores. No lo uses en el coche: se deforma con el calor.",
  },
  {
    nombre: "PETG",
    aguanta: "75 °C",
    texto: "Aguanta sol y humedad. Para exteriores y piezas que cargan peso.",
  },
  {
    nombre: "TPU",
    aguanta: "60 °C",
    texto: "Flexible. Empaques, topes, piezas que amortiguan.",
  },
] as const;

/** Numeral grande de sección: da estructura sin añadir texto que leer. */
function Numeral({ n, oscuro = false }: { n: string; oscuro?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`cifra block text-[3.5rem] leading-none ${
        oscuro ? "text-texto-secundario" : "text-cemento"
      }`}
    >
      {n}
    </span>
  );
}

export default function Inicio() {
  return (
    <main id="contenido">
      <JsonLd datos={schemaServicios()} />

      {/* ═══════════ 1 · Hero — promesa. Habla a todas. ═══════════ */}
      <Seccion
        estratos
        intensidadEstratos={0.13}
        desbordable
        fondo="inicio"
        opacidadFondo={0.16}
      >
        <div className="contenido grid items-center gap-12 py-16 md:grid-cols-[1fr_1.1fr] md:gap-8 md:py-24">
          {/* Sin <Reveal> sobre el fold: su estado inicial es opacity:0 y
              retrasaría el LCP hasta que hidratara el JS (§6). */}
          <div className="relative z-10">
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

          {/* ── La cama de impresión.
              Panel Grafito que se sale del contenedor por la derecha: rompe la
              rejilla y mete superficie oscura en la primera pantalla, que es
              justo lo que le faltaba al §4.1 (Grafito al 25%). ── */}
          <div className="relative md:-mr-[max(0px,calc((100vw-var(--container-contenido))/2))]">
            <div className="relative bg-grafito">
              {/* Plano 1 · superficie, a 0.40x */}
              <ParallaxLayer depth={1} className="absolute inset-0">
                <Strata
                  className="h-full w-full"
                  oscuro
                  intensidad={0.5}
                  separacion={10}
                />
              </ParallaxLayer>

              {/* Plano 2 · la pieza imprimiéndose capa por capa */}
              <div className="relative px-10 py-14 sm:px-16 sm:py-16">
                <PrintReveal>
                  {/* Única imagen con `priority`: es el LCP (§6). */}
                  <Foto
                    nombre="hero-pieza"
                    alt="Pieza recién impresa en filamento color hueso, todavía sobre la cama de impresión, con las líneas de capa visibles."
                    ancho={1200}
                    alto={1200}
                    sizes="(min-width: 768px) 46vw, 100vw"
                    priority
                  />
                </PrintReveal>
              </div>

              {/* Plano 3 · cotas, a 1.12x — van MÁS RÁPIDO que el contenido, y
                  por eso se sienten por delante del objeto */}
              <ParallaxLayer
                depth={3}
                className="absolute inset-x-10 bottom-5 sm:inset-x-16"
              >
                <DimensionLine medida="21.0 cm" invertido />
              </ParallaxLayer>
            </div>
          </div>
        </div>
      </Seccion>

      {/* ═══════════ 2 · Producto en contexto ═══════════ */}
      <Seccion tono="cemento" titulaPor="en-contexto">
        <div className="contenido bajo-fold py-20">
          {/* El rastro que deja la boquilla al rellenar una capa. */}
          <Trayectoria className="mb-12 opacity-70" />
          <Reveal>
            <Numeral n="02" />
            <h2 id="en-contexto" className="mt-3 font-titulo text-h2">
              Así se ve en la mano
            </h2>
            <p className="medida mt-4 text-texto-secundario">
              Nunca vas a ver una pieza flotando sin referencia de tamaño. Las
              medidas van sobre la foto porque comprar a ciegas termina en
              devolución.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-10 md:grid-cols-[1.4fr_auto] md:gap-16">
            <div>
              {/* Foto de la pieza EN USO REAL: en la mano, en el cajón, montada. */}
              <Foto
                nombre="pieza-en-uso"
                alt="Una mano sostiene una pieza impresa en 3D, de forma que se aprecia su tamaño real contra los dedos."
                ancho={1500}
                alto={1000}
                sizes="(min-width: 768px) 60vw, 100vw"
              />

              <ParallaxLayer depth={3} className="mt-4">
                <DimensionLine medida="18.4 cm" />
              </ParallaxLayer>
            </div>

            <div className="hidden md:block">
              <DimensionLine medida="11.2 cm" orientacion="vertical" />
            </div>
          </div>
        </div>
      </Seccion>

      {/* ═══════════ 3 · Las tres líneas ═══════════ */}
      <Seccion estratos intensidadEstratos={0.1} titulaPor="lineas">
        <div className="contenido bajo-fold py-20">
          <Reveal>
            <Numeral n="03" />
            <h2 id="lineas" className="mt-3 font-titulo text-h2">
              Tres formas de pedir
            </h2>
          </Reveal>

          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {LINEAS.map((l, i) => (
              <li key={l.titulo}>
                {/* Borde de 1px en Cemento (§7.1). La tarjeta es un contenedor,
                    no un control: el control es el enlace de dentro, que sí
                    lleva contraste y foco propios (§4.1.1, consecuencia 2). */}
                <Reveal delay={(i + 1) as 1 | 2 | 3}>
                  <article className="flex h-full flex-col border border-cemento bg-hueso">
                    {/* La cabecera de cada tarjeta va en Grafito: la pieza se
                        imprime sobre superficie oscura y el bloque gana peso. */}
                    <div className="relative overflow-hidden bg-grafito px-10 pt-8 pb-4">
                      <Strata
                        className="absolute inset-0"
                        oscuro
                        intensidad={0.45}
                        separacion={10}
                      />
                      <PrintReveal className="relative">
                        <Pieza forma={l.forma} conCama invertido />
                      </PrintReveal>
                    </div>

                    <div className="flex grow flex-col p-8">
                      <h3 className="font-titulo text-h3">{l.titulo}</h3>
                      <p className="mt-3 grow text-texto-secundario">
                        {l.texto}
                      </p>
                      <p className="mt-6">
                        <Link
                          href={l.href}
                          className="inline-flex min-h-[44px] items-center font-titulo text-detalle font-semibold text-arcilla-oscura underline underline-offset-4 transition-colors duration-[120ms] hover:text-grafito"
                        >
                          {l.enlace}
                        </Link>
                      </p>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Seccion>

      {/* ═══════════ 4 · Franja de confianza — banda oscura a todo lo ancho ═══════════ */}
      <Seccion tono="grafito">
        <div className="contenido bajo-fold py-4">
          <TrustStrip oscuro />
        </div>
      </Seccion>

      {/* ═══════════ 5 · El proceso a la vista ═══════════ */}
      {/* En Grafito: es la prueba física de que el taller existe, y en oscuro
          el timelapse y las capas se leen mucho mejor. */}
      <Seccion
        tono="grafito"
        estratos
        intensidadEstratos={0.4}
        titulaPor="proceso"
      >
        <div className="contenido bajo-fold py-24">
          <Trayectoria oscuro className="mb-14 opacity-80" />
          <div className="grid items-center gap-14 md:grid-cols-2">
            <Reveal>
              <Numeral n="05" oscuro />
              <h2 id="proceso" className="mt-3 font-titulo text-h2">
                Esto es una impresora, no un catálogo de stock
              </h2>
              {/* Cemento sobre Grafito = 9.72:1. El token texto-secundario daría
                1.99:1 aquí y no pasaría AA. */}
              <p className="medida mt-4 text-cemento">
                Cada pieza se fabrica cuando la pides. Por eso puedo cambiarle
                las medidas.
              </p>
              <p className="medida mt-4 text-detalle text-cemento">
                Ninguna de estas piezas está en un almacén esperando. La tuya
                empieza a existir el día que la pides.
              </p>
            </Reveal>

            {/* Timelapse REAL del taller — grabado por la cámara interna de la
                impresora (Bambu Lab), pieza creciendo capa por capa. Ruido de
                taller real, sin música (§14.4 — ya no es generado).

                autoplay muted loop playsinline, con poster y preload="metadata",
                NUNCA preload="auto" (§7.1 sección 5). */}
            <div className="relative mx-auto w-full max-w-[30rem]">
              <ParallaxLayer depth={1} className="absolute -inset-5">
                <div className="h-full w-full border border-cemento" />
              </ParallaxLayer>
              <div className="relative">
                {/* §7.1 sección 5: autoplay muted loop playsinline, con
                    poster y preload="metadata", NUNCA preload="auto".
                    width/height reservan el hueco: CLS cero. */}
                <video
                  className="block h-auto w-full"
                  width={1920}
                  height={1080}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={medio("timelapse-poster.webp")}
                  aria-label="Timelapse real de una impresora 3D construyendo una pieza capa por capa en el taller."
                >
                  <source src={medio("timelapse.mp4")} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </Seccion>

      {/* ═══════════ 6 · Materiales, en corto ═══════════ */}
      <Seccion tono="cemento" titulaPor="materiales">
        <div className="contenido bajo-fold py-20">
          <Reveal>
            <Numeral n="06" />
            <h2 id="materiales" className="mt-3 font-titulo text-h2">
              ¿Qué material le va a tu pieza?
            </h2>
            <p className="medida mt-4 text-texto-secundario">
              Tres opciones. Si no sabes cuál, dime para qué es y yo te la
              recomiendo.
            </p>
          </Reveal>

          <dl className="mt-12 grid gap-px border border-texto-secundario bg-texto-secundario md:grid-cols-3">
            {MATERIALES.map((m) => (
              <div key={m.nombre} className="flex flex-col bg-hueso">
                {/* Macro de la textura de capa: se ve de qué está hecha. */}
                <div className="h-24 w-full overflow-hidden border-b border-cemento">
                  <TexturaCapas />
                </div>
                <div className="flex grow flex-col p-8">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="cifra text-h3 text-grafito">{m.nombre}</dt>
                    <span className="cifra text-detalle text-texto-secundario">
                      hasta {m.aguanta}
                    </span>
                  </div>
                  <dd className="mt-3 text-texto-secundario">{m.texto}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </Seccion>

      {/* ═══════════ 7 · Reseñas — solo si existen de verdad ═══════════ */}
      <Reviews />

      {/* ═══════════ 8 · CTA final ═══════════ */}
      {/* `data-acento="arcilla"` — mientras esta sección esté en viewport, el
          botón flotante de WhatsApp se oculta. Nunca dos Arcilla a la vez. */}
      <div data-acento="arcilla">
        <Seccion
          tono="grafito"
          estratos
          intensidadEstratos={0.35}
          titulaPor="cta-final"
        >
          <div className="contenido bajo-fold grid items-center gap-12 py-24 md:grid-cols-[1.5fr_1fr]">
            <div>
              <h2 id="cta-final" className="font-titulo text-h2">
                ¿Tienes una pieza en la cabeza?
              </h2>
              <p className="medida mt-4 text-cemento">
                Mándame una foto o un boceto. Te contesto el mismo día con
                precio y fecha.
              </p>

              {/* Único elemento Arcilla de esta vista. Sobre Grafito, Arcilla da
                  3.37:1: suficiente para un botón sólido con texto blanco
                  encima — lo que se lee es el texto—, nunca para texto en
                  Arcilla. */}
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

            <div className="hidden md:block">
              <PrintReveal>
                <Pieza forma="tope" conCama invertido />
              </PrintReveal>
            </div>
          </div>
        </Seccion>
      </div>
    </main>
  );
}
