import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { url } from "@/lib/brand";
import { articuloPorSlug, articulos, type Articulo } from "@/lib/blog";
import { schemaMigas } from "@/lib/schema";

/* Con `output: export` cada artículo se genera en build desde el Markdown. */
export const dynamic = "force-static";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articulos().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const articulo = articuloPorSlug(slug);
  if (!articulo) return {};

  return {
    title: articulo.titulo,
    description: articulo.descripcion,
    alternates: { canonical: url(`/blog/${articulo.slug}`) },
    openGraph: {
      type: "article",
      locale: "es_MX",
      publishedTime: articulo.fecha,
      modifiedTime: articulo.actualizado,
    },
  };
}

/** YYYY-MM-DD → "5 de agosto de 2026". */
function formatearFecha(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "";
  return new Date(y, m - 1, d).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** BlogPosting + FAQPage — §8.3. El autor es el taller (§ @id del layout). */
function schemaArticulo(a: Articulo) {
  const bloques: unknown[] = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: a.titulo,
      description: a.descripcion,
      datePublished: a.fecha,
      dateModified: a.actualizado,
      inLanguage: "es-MX",
      author: { "@id": url("/#negocio") },
      publisher: { "@id": url("/#negocio") },
      mainEntityOfPage: url(`/blog/${a.slug}`),
      image: url("/opengraph-image"),
      ...(a.keywords.length > 0 ? { keywords: a.keywords.join(", ") } : {}),
    },
  ];

  if (a.preguntas.length > 0) {
    bloques.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: a.preguntas.map((p) => ({
        "@type": "Question",
        name: p.pregunta,
        acceptedAnswer: { "@type": "Answer", text: p.respuesta },
      })),
    });
  }

  bloques.push(
    schemaMigas([
      { nombre: "Blog", href: "/blog" },
      { nombre: a.titulo, href: `/blog/${a.slug}` },
    ]),
  );

  return bloques;
}

export default async function Articulo({ params }: Props) {
  const { slug } = await params;
  const articulo = articuloPorSlug(slug);
  if (!articulo) notFound();

  const relacionados = articulo.relacionados
    .map(articuloPorSlug)
    .filter((a): a is Articulo => Boolean(a));

  return (
    <main id="contenido">
      <JsonLd datos={schemaArticulo(articulo)} />

      <div className="contenido py-16">
        <article className="mx-auto max-w-3xl">
          <header>
            <p className="text-detalle text-texto-secundario">
              {formatearFecha(articulo.fecha)} · {articulo.lecturaMin} min de
              lectura
            </p>
            <h1 className="mt-3 font-titulo text-h1">{articulo.titulo}</h1>
            <p className="medida mt-5 text-texto-secundario">
              {articulo.descripcion}
            </p>
          </header>

          <div
            className="blog-articulo mt-12"
            dangerouslySetInnerHTML={{ __html: articulo.contenidoHtml }}
          />
        </article>

        {relacionados.length > 0 && (
          <aside
            className="mx-auto mt-16 max-w-3xl border-t border-cemento pt-8"
            aria-labelledby="relacionados"
          >
            <h2 id="relacionados" className="font-titulo text-h3">
              Sigue leyendo
            </h2>
            <ul className="mt-4 space-y-3">
              {relacionados.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/blog/${r.slug}`}
                    className="text-detalle text-arcilla-oscura underline underline-offset-4 hover:text-grafito"
                  >
                    {r.titulo}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </main>
  );
}
