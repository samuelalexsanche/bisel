import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { BASE_URL, BRAND, ES_PREVIEW } from "@/lib/brand";
import { schemaNegocio } from "@/lib/schema";
import "@/styles/globals.css";

/* Ambas son fuentes variables: se omite `weight` a propósito para servir un solo
   archivo por familia en lugar de uno por peso (§6, presupuesto de red). */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${BRAND.name} · ${BRAND.descriptor}`,
    template: `%s · ${BRAND.name}`,
  },
  description: `Fabrico refacciones, organizadores y objetos a medida en ${BRAND.city}. Catálogo con envío nacional, piezas bajo pedido y lotes para eventos.`,
  alternates: { canonical: "/" },
  // El demo no se indexa mientras el nombre y el dominio sigan pendientes (§14.1).
  ...(ES_PREVIEW ? { robots: { index: false, follow: false } } : {}),
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: BRAND.name,
    url: BASE_URL,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  // Nunca se desactiva el zoom (§6, accesibilidad).
  width: "device-width",
  initialScale: 1,
  themeColor: "#F4F1EA",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /* Sin `data-scroll-behavior="smooth"`: en Next 16 ese atributo es lo que
       reactiva el scroll suave forzado durante la navegación, y §5.4.8 lo
       prohíbe. El usuario manda sobre su scroll. */
    <html lang="es-MX" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
        {/*
          Criterio 10 — las páginas deben renderizar su contenido completo con
          JavaScript desactivado. Las primitivas que dependen del
          IntersectionObserver arrancan en opacity:0, así que sin JS quedarían
          invisibles para siempre. Esto las lleva a su estado final.

          <PrintReveal> solo se neutraliza donde NO hay view-timeline: con
          soporte nativo se anima por CSS puro y no necesita JS.
        */}
        <noscript>
          <style>{`
            .reveal,.strata-sweep>*{opacity:1!important;transform:none!important}
            .cota__linea{transform:none!important}
            .cota__tope,.cota__cifra{opacity:1!important}
            @supports not (animation-timeline: view()){
              .print__cuerpo{clip-path:none!important}
              .print__boquilla{display:none!important}
            }
          `}</style>
        </noscript>
      </head>
      <body className="font-cuerpo antialiased">
        {/* Skip-link al contenido principal (§6). Invisible hasta recibir foco. */}
        <a
          href="#contenido"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:border-2 focus-visible:border-grafito focus-visible:bg-hueso focus-visible:px-4 focus-visible:py-3 focus-visible:font-titulo focus-visible:font-semibold"
        >
          Saltar al contenido
        </a>

        <JsonLd datos={schemaNegocio()} />
        <Header />
        {children}
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
