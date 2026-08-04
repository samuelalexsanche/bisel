import { medio } from "@/lib/rutas";

type Props = {
  /** Archivo dentro de /medios/fondos, sin extensión. */
  nombre: string;
  /**
   * Opacidad. Se mantiene baja a propósito: el color sólido de la sección
   * sigue mandando y el contraste del texto no se mueve de lo verificado en
   * §4.1.1. Subirla por encima de 0.2 obliga a volver a medir el contraste.
   */
  opacidad?: number;
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
export function FondoFoto({ nombre, opacidad = 0.14 }: Props) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ opacity: opacidad }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={medio(`fondos/${nombre}.webp`)}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
