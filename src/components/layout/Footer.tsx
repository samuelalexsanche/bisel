import Link from "next/link";

import { Logo } from "@/components/brand/Logo";
import { BRAND, REDES } from "@/lib/brand";
import { TRAZO } from "@/lib/iconos";

/**
 * Icono de red social — §3.1, trazo fijo 1.75.
 * Instagram tiene su glifo; cualquier otra red cae en un globo genérico.
 */
function IconoRed(host: string) {
  if (host.includes("instagram")) {
    return (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth={TRAZO}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth={TRAZO}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

const NAV = [
  { href: "/catalogo", texto: "Catálogo" },
  { href: "/modelos", texto: "Modelos" },
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
              {REDES.map((u) => {
                const host = new URL(u).hostname.replace("www.", "");
                const etiqueta =
                  "@" + new URL(u).pathname.split("/").filter(Boolean).pop();
                return (
                  <li key={u}>
                    <a
                      href={u}
                      target="_blank"
                      rel="noopener"
                      aria-label={`${BRAND.name} en ${host.split(".")[0]}`}
                      className="inline-flex min-h-[44px] items-center gap-2 text-detalle text-cemento transition-colors duration-[120ms] hover:text-hueso"
                    >
                      {IconoRed(host)}
                      {etiqueta}
                    </a>
                  </li>
                );
              })}
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
