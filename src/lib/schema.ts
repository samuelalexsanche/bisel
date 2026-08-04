import { BASE_URL, BRAND, REDES, url } from "@/lib/brand";
import { PREGUNTAS } from "@/lib/datos";
import { PRODUCTOS } from "@/lib/productos";

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
    /* Coordenadas a nivel de CIUDAD, no de puerta.
       El taller declara Guadalajara pero no publica dirección de calle, así que
       poner un punto exacto sería inventarlo. Google acepta geo de ciudad para
       negocios de servicio sin local a pie de calle. */
    geo: {
      "@type": "GeoCoordinates",
      latitude: 20.6597,
      longitude: -103.3496,
    },

    /* El cierre a las 19:00 NO está inventado: sale del texto del §7.2 —
       "si llega después de las 7 pm, al día siguiente por la mañana".
       PENDIENTE: la hora de apertura sí hay que confirmarla con Samuel. */
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "19:00",
      },
    ],

    // PENDIENTE §14.7 — sin ficha de Google Business verificada, el schema
    // LocalBusiness por sí solo NO habilita el paquete local. Hacen falta las
    // dos cosas (§8.2).
    areaServed: [
      { "@type": "City", name: BRAND.city },
      { "@type": "Country", name: "México" },
    ],
    priceRange: "$180-$9000 MXN",
    currenciesAccepted: "MXN",

    /* `image` y `logo` los usa Google en resultados locales y en el panel de
       conocimiento. Apuntan a la imagen Open Graph, que se genera en el build. */
    image: url("/opengraph-image"),
    logo: url("/opengraph-image"),

    /* Materia sobre la que el negocio es competente. Ayuda a los motores
       generativos a decidir cuándo citarlo (§9). Todo sale del contenido real
       del sitio, nada inventado. */
    knowsAbout: [
      "Impresión 3D",
      "Manufactura aditiva",
      "Refacciones a medida",
      "PLA",
      "PETG",
      "TPU",
      "Prototipado",
    ],

    founder: { "@id": ID_FUNDADOR },
    ...(REDES.length > 0 ? { sameAs: REDES } : {}),
  };
}

/** WebSite — declara el sitio como entidad propia, distinta del negocio. */
export function schemaSitio() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": url("/#sitio"),
    url: BASE_URL,
    name: BRAND.name,
    inLanguage: "es-MX",
    publisher: { "@id": ID_NEGOCIO },
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
      min: 180,
      max: 450,
    },
    {
      name: "Piezas a medida bajo pedido",
      description:
        "Refacciones y piezas que ya no se fabrican, hechas a partir de una foto y unas medidas. De 3 a 5 días hábiles.",
      min: 350,
      max: 1800,
    },
    {
      name: "Personalizados para eventos y negocios",
      description:
        "Lotes de 50 a 200 piezas para bodas, XV años y eventos de empresa. De 7 a 14 días hábiles.",
      min: 1500,
      max: 9000,
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
    /* Rangos reales del §1. Un `Offer` con precio concreto sería inventarlo:
       estos servicios se cotizan, así que va `PriceSpecification` con rango. */
    offers: {
      "@type": "Offer",
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: s.min,
        maxPrice: s.max,
        priceCurrency: "MXN",
      },
    },
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

/**
 * Product — §8.3, "cada ficha de catálogo, CUANDO EXISTAN PRODUCTOS".
 *
 * Solo emite schema para piezas reales con link de pago. Publicar `Product`
 * con `offers` de una ficha de muestra sería declarar a Google que hay algo a
 * la venta que no existe: contenido inventado (criterio 12) y, además, motivo
 * de penalización por datos estructurados que no coinciden con la página.
 *
 * Mientras el catálogo sea de muestra esta función devuelve lista vacía y no
 * se inyecta nada. Es correcto y es deliberado.
 */
export function schemaProductos() {
  return PRODUCTOS.filter((p) => !p.muestra && p.linkPago).map((p) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.nombre,
    description: p.descripcion,
    sku: p.id,
    material: p.material,
    brand: { "@id": ID_NEGOCIO },
    ...(p.foto ? { image: url(`/medios/catalogo/${p.foto}.webp`) } : {}),
    offers: {
      "@type": "Offer",
      price: p.precio,
      priceCurrency: "MXN",
      availability: "https://schema.org/InStock",
      url: p.linkPago,
      seller: { "@id": ID_NEGOCIO },
    },
  }));
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
