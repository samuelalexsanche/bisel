import Link from "next/link";

import { Logo } from "@/components/brand/Logo";
import { BRAND, REDES } from "@/lib/brand";

const NAV = [
  { href: "/catalogo", texto: "Catálogo" },
  { href: "/cotiza", texto: "Cotiza tu pieza" },
  { href: "/como-funciona", texto: "Cómo funciona" },
  { href: "/quien-hace-esto", texto: "Quién hace esto" },
] as const;

/**
 * Pie — §7.0. Fondo Grafito, texto Hueso.
 *
 * Nota de contraste: sobre Grafito, el token `texto-secundario` daría 1.99:1 y
 * no pasaría AA. Aquí el texto de apoyo va en Cemento, que sobre Grafito da
 * 9.72:1. Es el mismo token del §4.1, cambia la superficie, no la paleta.
 *
 * §8.2 — la ciudad y el estado se declaran aquí, y el NAP debe coincidir
 * carácter por carácter con Google Business, Facebook e Instagram.
 *
 * §10 — no hay ningún enlace a Mattera Systems: los enlaces de sitio completo
 * entre ambos dominios están prohibidos (criterio 15).
 */
export function Footer() {
  return (
    <footer className="sobre-grafito mt-24 bg-grafito text-hueso">
      <div className="contenido grid gap-12 py-16 md:grid-cols-3">
        <div>
          <Logo invertido />
          <p className="mt-5 max-w-xs text-detalle text-cemento">
            {BRAND.descriptor}. Cada pieza se fabrica cuando la pides.
          </p>
        </div>

        <nav aria-label="Pie de página">
          <h2 className="font-titulo text-detalle font-semibold text-hueso">
            Secciones
          </h2>
          <ul className="mt-4 space-y-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-[44px] items-center text-detalle text-cemento transition-colors duration-[120ms] hover:text-hueso"
                >
                  {item.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-titulo text-detalle font-semibold text-hueso">
            Contacto
          </h2>
          <address className="mt-4 space-y-1 text-detalle text-cemento not-italic">
            <p>
              <a
                href={`mailto:${BRAND.email}`}
                className="inline-flex min-h-[44px] items-center transition-colors duration-[120ms] hover:text-hueso"
              >
                {BRAND.email}
              </a>
            </p>
            {/* Ubicación declarada — sin taller anónimo (§7.5, §8.2). */}
            <p className="cifra text-hueso">
              {BRAND.city}, {BRAND.state}
            </p>
          </address>

          {REDES.length > 0 && (
            <ul className="mt-4 flex gap-4">
              {REDES.map((u) => (
                <li key={u}>
                  <a
                    href={u}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex min-h-[44px] items-center text-detalle text-cemento underline underline-offset-4 hover:text-hueso"
                  >
                    {new URL(u).hostname.replace("www.", "")}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="border-t border-cemento">
        <div className="contenido flex flex-wrap items-center justify-between gap-4 py-6 text-detalle text-cemento">
          <p>
            © {new Date().getFullYear()} {BRAND.legalName}
          </p>
          <p>
            Hecho en {BRAND.city}, {BRAND.state}
          </p>
        </div>
      </div>
    </footer>
  );
}
