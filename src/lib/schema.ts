import { BASE_URL, BRAND, REDES, url } from "@/lib/brand";
import { PREGUNTAS } from "@/lib/datos";

/**
 * Datos estructurados — §8.3. Se inyectan como JSON-LD.
 *
 * §10 — el fundador se declara como la MISMA `Person` en los dos proyectos, con
 * `sameAs` apuntando a ambos dominios. Es la forma correcta de darles autoridad
 * mutua: vincula las entidades sin mezclar las marcas ante el cliente y sin
 * caer en enlaces recíprocos de sitio completo, que son un esquema de enlaces
 * según las políticas de Google.
 */
const OTRO_PROYECTO_DEL_FUNDADOR = "https://mattera.mx";

const ID_NEGOCIO = url("/#negocio");
const ID_FUNDADOR = url("/#fundador");

/** Organization + LocalBusiness — layout raíz. */
export function schemaNegocio() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": ID_NEGOCIO,
    name: BRAND.name,
    legalName: BRAND.legalName,
    description: BRAND.descriptor,
    url: BASE_URL,
    email: BRAND.email,
    telephone: `+${BRAND.whatsapp}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: BRAND.city,
      addressRegion: BRAND.state,
      addressCountry: BRAND.country,
    },
    // PENDIENTE §14.7 — sin ficha de Google Business verificada, el schema
    // LocalBusiness por sí solo NO habilita el paquete local. Hacen falta las
    // dos cosas (§8.2).
    areaServed: [
      { "@type": "City", name: BRAND.city },
      { "@type": "Country", name: "México" },
    ],
    priceRange: "$$",
    founder: { "@id": ID_FUNDADOR },
    ...(REDES.length > 0 ? { sameAs: REDES } : {}),
  };
}

/** Person — página "Quién hace esto". */
export function schemaFundador() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": ID_FUNDADOR,
    name: BRAND.founder,
    jobTitle: "Fundador",
    worksFor: { "@id": ID_NEGOCIO },
    sameAs: [OTRO_PROYECTO_DEL_FUNDADOR, BASE_URL],
  };
}

/** Service × 3 — Inicio y Cómo funciona. */
export function schemaServicios() {
  const servicios = [
    {
      name: "Catálogo de piezas impresas en 3D",
      description:
        "Piezas ya diseñadas, listas para enviar a todo México. Organizadores, soportes y objetos para la casa.",
    },
    {
      name: "Piezas a medida bajo pedido",
      description:
        "Refacciones y piezas que ya no se fabrican, hechas a partir de una foto y unas medidas. De 3 a 5 días hábiles.",
    },
    {
      name: "Personalizados para eventos y negocios",
      description:
        "Lotes de 50 a 200 piezas para bodas, XV años y eventos de empresa. De 7 a 14 días hábiles.",
    },
  ];

  return servicios.map((s) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    description: s.description,
    provider: { "@id": ID_NEGOCIO },
    areaServed: { "@type": "Country", name: "México" },
    serviceType: "Manufactura aditiva",
  }));
}

/** FAQPage — Cómo funciona y Cotiza. */
export function schemaPreguntas() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PREGUNTAS.map((p) => ({
      "@type": "Question",
      name: p.pregunta,
      acceptedAnswer: { "@type": "Answer", text: p.respuesta },
    })),
  };
}

/** BreadcrumbList — todas las páginas menos Inicio. */
export function schemaMigas(
  ruta: ReadonlyArray<{ nombre: string; href: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ nombre: "Inicio", href: "/" }, ...ruta].map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.nombre,
      item: url(m.href),
    })),
  };
}

/** Serializa para <script type="application/ld+json">. */
export function jsonLd(datos: unknown): string {
  // Se escapa `<` para que no pueda cerrar el <script> desde el contenido.
  return JSON.stringify(datos).replace(/</g, "\\u003c");
}
