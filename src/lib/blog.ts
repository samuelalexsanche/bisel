import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

/**
 * Carga de artículos del blog — §nuevo (sección de contenido).
 *
 * Los artículos viven como Markdown con frontmatter en `content/blog/`:
 * escribibles por una persona, revisables en git y citables por los motores
 * generativos (GEO) sin pasar por la base de datos del CMS.
 *
 * Se leen en tiempo de build (server-only): con `output: export` el HTML de
 * cada artículo sale completo en el build, sin JavaScript (§8.1, criterio 10).
 */

export type Articulo = {
  slug: string;
  titulo: string;
  descripcion: string;
  keywords: string[];
  cluster: string;
  tipo: "pilar" | "soporte";
  /** YYYY-MM-DD — el frontmatter la declara; nunca se inventa "hoy". */
  fecha: string;
  actualizado: string;
  autor: string;
  extensionPalabras: number;
  lecturaMin: number;
  cta: string;
  relacionados: string[];
  contenidoHtml: string;
  /** Extraídas de la sección "## Preguntas frecuentes" para el FAQPage (§8.3). */
  preguntas: { pregunta: string; respuesta: string }[];
};

const DIR = path.join(process.cwd(), "content", "blog");

/**
 * YAML convierte `2026-08-05` en Date; aquí se vuelve a "YYYY-MM-DD".
 * Los demás valores (strings, números, arreglos) pasan tal cual.
 */
function aIso(valor: unknown): string {
  if (valor instanceof Date) {
    const y = valor.getFullYear();
    const m = String(valor.getMonth() + 1).padStart(2, "0");
    const d = String(valor.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return String(valor ?? "");
}

/** Texto de respuesta para el schema: sin marcas, sin enlaces. */
function textoPlano(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // enlaces → su texto
    .replace(/\*\*([^*]+)\*\*/g, "$1") // negritas
    .replace(/\*([^*]+)\*/g, "$1") // itálicas
    .replace(/\n{2,}/g, " ")
    .trim();
}

/**
 * Extrae la sección FAQ del cuerpo. Convención propia de estos artículos:
 * cada respuesta es UN párrafo bajo su `### pregunta`, y el pie de página
 * (párrafo solo itálica) queda pegado a la última respuesta — se recorta.
 */
function extraerPreguntas(cuerpo: string): Articulo["preguntas"] {
  const lineas = cuerpo.split("\n");
  const inicio = lineas.findIndex((l) =>
    l.trim().startsWith("## Preguntas frecuentes"),
  );
  if (inicio === -1) return [];

  const preguntas: Articulo["preguntas"] = [];
  let actual: { pregunta: string; respuesta: string } | null = null;
  let buffer: string[] = [];

  const cerrar = () => {
    if (!actual) return;
    const parrafos = buffer.join(" ").trim().split(/\n{2,}/);
    while (
      parrafos.length > 1 &&
      /^\*[^*]+\*$/.test(parrafos[parrafos.length - 1].trim())
    ) {
      parrafos.pop(); // pie de página itálico
    }
    const respuesta = parrafos.join(" ").trim();
    if (respuesta) {
      preguntas.push({
        pregunta: actual.pregunta,
        respuesta: textoPlano(respuesta),
      });
    }
    actual = null;
    buffer = [];
  };

  for (const linea of lineas.slice(inicio + 1)) {
    const t = linea.trim();
    if (t.startsWith("### ")) {
      cerrar();
      actual = { pregunta: t.slice(4).trim(), respuesta: "" };
    } else if (t.startsWith("## ") || t === "---") {
      cerrar();
      break;
    } else if (actual && t.length > 0) {
      buffer.push(t);
    }
  }
  cerrar();
  return preguntas;
}

function parsearArchivo(nombre: string): Articulo {
  const crudo = fs.readFileSync(path.join(DIR, nombre), "utf8");
  const { data, content } = matter(crudo);
  const cuerpo = content.trim();

  return {
    slug: String(data.slug ?? nombre.replace(/\.md$/, "")),
    titulo: String(data.titulo ?? ""),
    descripcion: String(data.descripcion ?? ""),
    keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : [],
    cluster: String(data.cluster ?? ""),
    tipo: data.tipo === "pilar" ? "pilar" : "soporte",
    fecha: aIso(data.fecha),
    actualizado: aIso(data.actualizado ?? data.fecha ?? ""),
    autor: String(data.autor ?? ""),
    extensionPalabras: Number(data.extension_palabras ?? 0),
    lecturaMin: Number(data.lectura_min ?? 0),
    cta: String(data.cta ?? ""),
    relacionados: Array.isArray(data.relacionados)
      ? data.relacionados.map(String)
      : [],
    contenidoHtml: marked.parse(cuerpo, { async: false }) as string,
    preguntas: extraerPreguntas(cuerpo),
  };
}

/** Todos los artículos, más recientes primero. Se leen en cada build. */
export function articulos(): Articulo[] {
  const archivos = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();

  return archivos
    .map(parsearArchivo)
    .sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
}

export function articuloPorSlug(slug: string): Articulo | undefined {
  return articulos().find((a) => a.slug === slug);
}
