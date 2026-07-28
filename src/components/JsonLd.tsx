import { jsonLd } from "@/lib/schema";

/**
 * Inyecta datos estructurados — §8.3.
 *
 * Se renderiza en el servidor, así que el JSON-LD está en el HTML inicial y no
 * depende de que ejecute JavaScript (§8.1, criterio 10).
 */
export function JsonLd({ datos }: { datos: unknown }) {
  const bloques = Array.isArray(datos) ? datos : [datos];

  return (
    <>
      {bloques.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(d) }}
        />
      ))}
    </>
  );
}
