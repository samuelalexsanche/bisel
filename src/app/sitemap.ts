import type { MetadataRoute } from "next";

import { articulos } from "@/lib/blog";
import { url } from "@/lib/brand";

/* `output: export` exige declarar estático cada route handler de metadatos. */
export const dynamic = "force-static";

/**
 * §8.1. Las cinco páginas son estáticas, así que el sitemap es estático.
 *
 * No se usa `generateSitemaps`: en Next 16 eso obliga a recibir el `id` como
 * promesa y no aporta nada con cinco URLs.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date();

  return [
    {
      url: url("/"),
      lastModified: ahora,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: url("/servicios"),
      lastModified: ahora,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: url("/cotiza"),
      lastModified: ahora,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: url("/calculadora"),
      lastModified: ahora,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: url("/modelos"),
      lastModified: ahora,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: url("/catalogo"),
      lastModified: ahora,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: url("/como-funciona"),
      lastModified: ahora,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: url("/quien-hace-esto"),
      lastModified: ahora,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: url("/blog"),
      lastModified: ahora,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    /* Los artículos salen del frontmatter: la fecha de modificación es la
       declarada, no "ahora", para que el sitemap no cambie en cada build. */
    ...articulos().map((a) => ({
      url: url(`/blog/${a.slug}`),
      lastModified: new Date(`${a.actualizado}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
