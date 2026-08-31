import { medio } from "@/lib/rutas";

type Props = {
  /** Archivo dentro de /medios/fondos, sin extensión. */
  nombre: string;
  /**
   * Texto alternativo para el rastreador. La imagen es decorativa para
   * lectores de pantalla (aria-hidden), pero los buscadores piden un alt
   * descriptivo; sin él, el scan de Bing marca la página como "alt faltante".
   */
  alt?: string;
  /**
   * Opacidad. Se mantiene baja a propósito: el color sólido de la sección
   * sigue mandando y el contraste del texto no se mueve de lo verificado en
   * §4.1.1. Subirla por encima de 0.2 obliga a volver a medir el contraste.
   */
  opacidad?: number;
};

/** Alt descriptivo por fondo — cubre los 8 usos del sitio. */
const ALT_POR_NOMBRE: Record<string, string> = {
  inicio: "Pieza impresa en 3D del taller Bisel en Guadalajara",
  "como-funciona": "Taller de impresión 3D de Bisel en Guadalajara",
  capas: "Capas de una pieza impresa en 3D por Bisel",
  catalogo: "Piezas del catálogo de Bisel impresas en 3D",
  cotiza: "Pieza a medida impresa en 3D por Bisel",
  "quien-hace-esto": "Taller de Bisel, impresión 3D en Guadalajara",
};

/**
 * Fondo fotográfico de sección.
 *
 * Va detrás de todo, decorativo y sin capturar el ratón. La foto se recorta a
 * la sección y no impone altura: si la sección crece, el fondo la sigue.
 *
 * Es `<img>` y no `next/image` a propósito: con `fill` y `unoptimized` el
 * componente no aporta nada aquí, y así se controla el `loading` sin pelear
 * con el layout.
 */
export function FondoFoto({ nombre, alt, opacidad = 0.14 }: Props) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ opacity: opacidad }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={medio(`fondos/${nombre}.webp`)}
        alt={alt ?? ALT_POR_NOMBRE[nombre] ?? `Fondo ${nombre}`}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
