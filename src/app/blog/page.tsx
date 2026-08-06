import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/JsonLd";
import { url } from "@/lib/brand";
import { articulos } from "@/lib/blog";
import { schemaMigas } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Blog de impresión 3D",
  description:
    "Guías prácticas de impresión 3D: qué imprimir, cuánto cuesta en México, qué material elegir y cómo pedir tu primera pieza sin tropezarte.",
  alternates: { canonical: url("/blog") },
};

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

export default function Blog() {
  const lista = articulos();

  return (
    <main id="contenido">
      <JsonLd datos={schemaMigas([{ nombre: "Blog", href: "/blog" }])} />

      <div className="contenido py-16">
        <header className="max-w-3xl">
          <h1 className="font-titulo text-h1">Blog</h1>
          <p className="medida mt-5 text-texto-secundario">
            Guías prácticas de impresión 3D: qué imprimir, cuánto cuesta, qué
            material elegir y cómo pedir tu primera pieza sin tropezarte.
          </p>
        </header>

        <ul className="mt-16 grid gap-6 sm:grid-cols-2">
          {lista.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/blog/${a.slug}`}
                className="flex h-full flex-col border border-cemento p-6 transition-colors duration-[120ms] hover:border-grafito"
              >
                <span className="text-detalle text-texto-secundario">
                  {formatearFecha(a.fecha)} · {a.lecturaMin} min de lectura
                </span>
                <h2 className="mt-3 font-titulo text-h3">{a.titulo}</h2>
                <p className="mt-3 text-detalle text-texto-secundario">
                  {a.descripcion}
                </p>
                <span className="mt-auto pt-4 text-detalle text-arcilla-oscura underline underline-offset-4">
                  Leer artículo
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
