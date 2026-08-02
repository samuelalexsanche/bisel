import type { MetadataRoute } from "next";

import { INDEXABLE, url } from "@/lib/brand";

/* `output: export` exige declarar estático cada route handler de metadatos. */
export const dynamic = "force-static";

/**
 * §8.1. Se permite explícitamente a los rastreadores de los motores
 * generativos: si no pueden leer el sitio, no pueden citarlo (§9).
 *
 * /motion-lab se excluye por si sobreviviera a un despliegue por error.
 */
export default function robots(): MetadataRoute.Robots {
  /* El preview no se indexa. Es un demo bajo un nombre que todavía no está
     verificado en IMPI (§14.1) y con contenido incompleto: si Google lo indexa,
     compite contra el sitio definitivo por las mismas consultas y hay que
     limpiarlo después. Se levanta solo con quitar NEXT_PUBLIC_SITE_URL. */
  if (!INDEXABLE) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  const generativos = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "PerplexityBot",
    "ClaudeBot",
    "Claude-User",
    "Google-Extended",
  ];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/motion-lab"] },
      ...generativos.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/motion-lab"],
      })),
    ],
    sitemap: url("/sitemap.xml"),
    host: url("/"),
  };
}
