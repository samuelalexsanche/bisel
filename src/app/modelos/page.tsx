import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/JsonLd";
import { FondoFoto } from "@/components/layout/FondoFoto";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { Thumb } from "@/components/sitios/Thumb";
import { BRAND, url } from "@/lib/brand";
import { schemaMigas } from "@/lib/schema";
import { BUSCADORES, EDITORES, SITIOS } from "@/lib/sitios";

export const metadata: Metadata = {
  title: "10 sitios para descargar modelos STL gratis (2026)",
  description:
    "Los sitios que más se usan para descargar modelos STL gratis en 2026 —Printables, Thingiverse, Cults 3D, MakerWorld y más— y cómo imprimirlos si no tienes impresora.",
  alternates: { canonical: url("/modelos") },
};

/** Preguntas reales de quien llega buscando archivos, con la respuesta corta. */
const FAQ = [
  {
    pregunta: "¿Cuál es el mejor sitio para descargar modelos STL gratis?",
    respuesta:
      "Depende de lo que busques. Para piezas funcionales con perfil de impresión incluido, Printables; para variedad y cosas raras, Thingiverse; para modelos muy pulidos, Cults 3D; y si tienes una Bambu Lab, MakerWorld. Los cuatro son gratis y permiten descargar el archivo sin pagar.",
  },
  {
    pregunta: "¿Puedo vender lo que imprimo desde un modelo descargado?",
    respuesta:
      "Solo si la licencia lo permite. Las licencias CC0, CC BY y CC BY-SA permiten uso comercial (con crédito en las dos últimas); las que dicen NC (No Comercial) prohíben vender la pieza. Antes de imprimir para vender, revisa la ficha del modelo: casi todos los sitios la muestran junto al botón de descarga.",
  },
  {
    pregunta: "No tengo impresora, ¿pueden imprimir un archivo que descargué?",
    respuesta:
      "Sí. Descarga tu STL y mándalo por WhatsApp o al correo: reviso que la malla esté bien, te digo si hace falta repararla, y te paso precio y fecha el mismo día. La licencia del modelo la traes tú; el taller cobra la impresión, no el diseño.",
  },
  {
    pregunta: "¿Cuánto cuesta imprimir un modelo que descargué?",
    respuesta:
      "Depende del tamaño y del material, no de si el archivo era gratis. Las piezas de catálogo van de $180 a $450 MXN; una pieza a medida, de $350 a $1,800 MXN. Puedes estimarlo en la calculadora del sitio antes de escribir.",
  },
  {
    pregunta: "¿Qué formatos de archivo puedo enviar?",
    respuesta:
      "Lo ideal es STL o 3MF; también acepto OBJ y STEP. Si traes un STL con la malla rota o sin cerrar, se puede reparar antes de imprimir: te lo aviso antes de cotizar, no después.",
  },
  {
    pregunta: "¿Cobran por descargar los modelos?",
    respuesta:
      "El taller no vende archivos: cobra la impresión. Los sitios de la lista son gratis (algunos piden crear cuenta) y Cults 3D, CGTrader o Pinshape además tienen modelos de pago. Lo que sí cobra el taller es imprimir la pieza que salga de ese archivo.",
  },
  {
    pregunta: "¿Hacen el diseño si el modelo no existe en ninguna parte?",
    respuesta:
      "Sí. Si no lo encuentras en ningún repositorio, se puede modelar desde una foto, un boceto o una pieza rota que sirva de muestra. El diseño se cotiza aparte ($250 MXN si es sencillo) y solo se cobra la primera vez.",
  },
];

const schemaItemList = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Sitios para descargar modelos STL gratis",
  itemListElement: SITIOS.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: s.nombre,
    url: s.url,
  })),
};

const schemaFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.pregunta,
    acceptedAnswer: { "@type": "Answer", text: f.respuesta },
  })),
};

export default function Modelos() {
  return (
    <main id="contenido" className="relative">
      <FondoFoto nombre="capas" />
      <div className="contenido relative py-16">
        <JsonLd datos={schemaMigas([{ nombre: "Modelos", href: "/modelos" }])} />
        <JsonLd datos={schemaItemList} />
        <JsonLd datos={schemaFaq} />

        <header className="max-w-3xl">
          <h1 className="font-titulo text-h1">
            Dónde descargar modelos STL gratis
          </h1>
          <p className="medida mt-5 text-texto-secundario">
            Los repositorios que más se usan para bajar modelos STL gratis son
            Printables, Thingiverse, Cults 3D y MakerWorld. Los cuatro permiten
            descargar el archivo sin pagar y filtrar por licencia. Lo único que
            casi ninguno incluye es la impresora.
          </p>
          <p className="medida mt-4 text-texto-secundario">
            Abajo están los diez sitios que conviene tener a mano, qué trae cada
            uno y qué revisar antes de imprimir. Si te falta impresora o
            material, tu archivo lo imprimo yo: el diseño no se cobra, solo la
            impresión.
          </p>
        </header>

        {/* Comparativa rápida: para elegir sin leer las diez fichas */}
        <section className="mt-12" aria-labelledby="comparativa">
          <h2 id="comparativa" className="font-titulo text-h3">
            Los diez, de un vistazo
          </h2>
          <div className="mt-5 overflow-x-auto border border-cemento">
            <table className="w-full min-w-[720px] border-collapse text-detalle">
              <thead>
                <tr className="bg-grafito text-hueso">
                  <th scope="col" className="p-3 text-left font-normal">
                    Sitio
                  </th>
                  <th scope="col" className="p-3 text-left font-normal">
                    Fuerte en
                  </th>
                  <th scope="col" className="p-3 text-left font-normal">
                    Pide cuenta
                  </th>
                  <th scope="col" className="p-3 text-left font-normal">
                    Licencias
                  </th>
                </tr>
              </thead>
              <tbody>
                {SITIOS.map((s) => (
                  <tr key={s.id} className="border-t border-cemento">
                    <th scope="row" className="p-3 text-left font-normal">
                      <span className="flex items-center gap-3">
                        <Thumb
                          siglas={s.siglas}
                          nombre={s.nombre}
                          tamano="sm"
                        />
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener nofollow"
                          className="text-arcilla-oscura underline underline-offset-4 hover:text-grafito"
                        >
                          {s.nombre}
                        </a>
                      </span>
                    </th>
                    <td className="p-3 text-texto-secundario">{s.fuerte}</td>
                    <td className="p-3 text-texto-secundario">{s.cuenta}</td>
                    <td className="p-3 text-texto-secundario">{s.licencias}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Las diez fichas */}
        <section className="mt-14" aria-labelledby="sitios">
          <h2 id="sitios" className="font-titulo text-h3">
            Los 10 sitios, uno por uno
          </h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-2">
            {SITIOS.map((s, i) => (
              <li key={s.id}>
                <Reveal delay={((i % 2) + 1) as 1 | 2}>
                  <article className="flex h-full flex-col border border-cemento bg-hueso p-6">
                    <div className="flex items-start gap-4">
                      <Thumb siglas={s.siglas} nombre={s.nombre} />
                      <div className="min-w-0">
                        <h3 className="font-titulo text-h3">{s.nombre}</h3>
                        <p className="cifra mt-1 text-detalle text-texto-secundario">
                          {s.fuerte}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 grow text-texto-secundario">
                      {s.resumen}
                    </p>
                    <dl className="mt-5 space-y-1 text-detalle">
                      <div className="flex justify-between gap-4 border-b border-cemento pb-1">
                        <dt className="text-texto-secundario">Cuenta</dt>
                        <dd className="text-grafito">{s.cuenta}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-texto-secundario">Licencias</dt>
                        <dd className="text-right text-grafito">
                          {s.licencias}
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-5">
                      <Button asChild variant="outline" className="w-full">
                        <a href={s.url} target="_blank" rel="noopener nofollow">
                          Abrir {s.nombre}
                        </a>
                      </Button>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        {/* Meta-buscadores: cuando no sabes el nombre de la pieza */}
        <section className="mt-14" aria-labelledby="buscadores">
          <h2 id="buscadores" className="font-titulo text-h3">
            Dos buscadores que barren todos los repositorios
          </h2>
          <p className="medida mt-4 text-texto-secundario">
            Si no sabes en cuál sitio está lo que buscas, empieza por aquí: la
            misma búsqueda en todos lados de una sola vez.
          </p>
          <ul className="mt-5 space-y-3">
            {BUSCADORES.map((b) => (
              <li
                key={b.nombre}
                className="border-l-2 border-grafito pl-4 text-texto-secundario"
              >
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener nofollow"
                  className="text-arcilla-oscura underline underline-offset-4 hover:text-grafito"
                >
                  {b.nombre}
                </a>{" "}
                — {b.nota}
              </li>
            ))}
          </ul>
        </section>

        {/* Licencias: lo que hay que revisar antes de imprimir para vender */}
        <section
          className="mt-12 border-2 border-grafito p-6"
          aria-labelledby="licencias"
        >
          <h2 id="licencias" className="font-titulo text-h3">
            Descargar gratis no es lo mismo que poder venderlo
          </h2>
          <ul className="medida mt-4 space-y-3 text-texto-secundario">
            <li>
              <span className="cifra text-grafito">CC0</span> — dominio
              público: puedes imprimir y vender sin pedir permiso.
            </li>
            <li>
              <span className="cifra text-grafito">CC BY / CC BY-SA</span> —
              puedes vender, pero citando al autor (y compartiendo igual si es
              SA).
            </li>
            <li>
              <span className="cifra text-grafito">NC</span> — no comercial: se
              puede imprimir para uno mismo, no vender.
            </li>
            <li>
              <span className="cifra text-grafito">Solo personal</span> — la
              mayoría de los modelos de pago del marketplace: uso propio, no
              venta.
            </li>
          </ul>
          <p className="medida mt-4 text-texto-secundario">
            El taller no imprime por encargo modelos con licencia no comercial
            de repositorios de terceros. Si el archivo lo traes tú, la licencia
            es tuya y la responsabilidad también: yo imprimo el archivo, no
            vendo el modelo.
          </p>
        </section>

        {/* Si el modelo no existe: diseñarlo */}
        <section className="mt-14" aria-labelledby="editores">
          <h2 id="editores" className="font-titulo text-h3">
            ¿Y si el modelo no existe en ningún sitio?
          </h2>
          <p className="medida mt-4 text-texto-secundario">
            Se diseña. Estos tres programas son el camino normal según qué tan
            técnico sea el proyecto:
          </p>
          <ul className="mt-6 grid gap-6 md:grid-cols-3">
            {EDITORES.map((e) => (
              <li key={e.nombre} className="border border-cemento bg-hueso p-6">
                <h3 className="font-titulo text-h3">{e.nombre}</h3>
                <p className="cifra mt-1 text-detalle text-texto-secundario">
                  {e.nivel}
                </p>
                <p className="mt-3 text-detalle text-texto-secundario">
                  {e.nota}
                </p>
                <a
                  href={e.url}
                  target="_blank"
                  rel="noopener nofollow"
                  className="mt-4 inline-block text-detalle text-arcilla-oscura underline underline-offset-4 hover:text-grafito"
                >
                  Ir a {e.nombre}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA: del archivo a la pieza */}
        <section
          className="mt-14 border-t-2 border-grafito pt-8"
          aria-labelledby="imprimir"
        >
          <h2 id="imprimir" className="font-titulo text-h3">
            Del STL a la pieza impresa
          </h2>
          <p className="medida mt-4 text-texto-secundario">
            Si ya bajaste el archivo y no tienes impresora —o no quieres
            pelearte con el rebanado, el relleno y los soportes—, eso es justo
            lo que hago: imprimir lo que otros diseñaron.
          </p>
          <ol className="medida mt-5 space-y-2 text-texto-secundario">
            <li>
              1. Mándame el STL (o el enlace del modelo) por WhatsApp o correo.
            </li>
            <li>
              2. Reviso la malla, te digo material y tamaño recomendados y te
              paso precio con fecha el mismo día.
            </li>
            <li>
              3. Se imprime en PLA, PETG o TPU, se revisa y se envía a cualquier
              parte de México.
            </li>
          </ol>
          <p className="medida mt-4 text-detalle text-texto-secundario">
            Precios del taller: piezas de catálogo desde $180 MXN, piezas a
            medida de $350 a $1,800 MXN. Envío a todo México desde {BRAND.city}.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/cotiza?tipo=archivo">Cotizar mi archivo</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/calculadora">Calcular el precio</Link>
            </Button>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-14" aria-labelledby="faq">
          <h2 id="faq" className="font-titulo text-h3">
            Preguntas frecuentes
          </h2>
          <div className="mt-6 max-w-3xl divide-y divide-cemento border-y border-cemento">
            {FAQ.map((f) => (
              <details key={f.pregunta} className="group py-4">
                <summary className="cursor-pointer list-none font-titulo text-h3 marker:content-none">
                  {f.pregunta}
                </summary>
                <p className="medida mt-3 text-texto-secundario">
                  {f.respuesta}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Enlaces internos: seguir el recorrido natural */}
        <aside className="mt-14 border-l-2 border-grafito pl-5" role="note">
          <h2 className="font-titulo text-h3">Para seguir</h2>
          <ul className="mt-3 space-y-2 text-texto-secundario">
            <li>
              <Link
                href="/blog/modelos-stl-gratis"
                className="text-arcilla-oscura underline underline-offset-4 hover:text-grafito"
              >
                Dónde conseguir modelos 3D (STL) gratis y de pago
              </Link>{" "}
              — la guía larga, con cómo buscar y qué evitar.
            </li>
            <li>
              <Link
                href="/blog/preparar-archivo-stl"
                className="text-arcilla-oscura underline underline-offset-4 hover:text-grafito"
              >
                Cómo preparar tu archivo STL antes de imprimir
              </Link>{" "}
              — revisar la malla, escala y orientación.
            </li>
            <li>
              <Link
                href="/catalogo"
                className="text-arcilla-oscura underline underline-offset-4 hover:text-grafito"
              >
                Catálogo de piezas listas para enviar
              </Link>{" "}
              — diseños del taller, sin esperar a que descargues nada.
            </li>
          </ul>
        </aside>
      </div>
    </main>
  );
}
