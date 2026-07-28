import { BRAND } from "@/lib/brand";

/**
 * Pantalla de carga — el logo se imprime capa por capa.
 *
 * Es la primera aplicación de la idea del §5.1: "el scroll ES el proceso de
 * impresión". Antes de que la página exista, se imprime la marca.
 *
 * CSS puro, sin una línea de JavaScript. Eso importa por tres razones:
 *   · con JS desactivado también desaparece sola, así que no puede dejar el
 *     sitio tapado (criterio 10);
 *   · no añade nada al presupuesto de JS (§6);
 *   · `prefers-reduced-motion` la elimina entera, no la "suaviza" (§5.4.5).
 *
 * El nombre sale de BRAND, nunca escrito literal (criterio 13).
 */
export function Cargando() {
  return (
    <div className="carga" aria-hidden="true">
      <div className="w-full max-w-xs px-6">
        {/* El wordmark, imprimiéndose */}
        <div className="print relative">
          <div className="carga__marca print__cuerpo">
            <span className="inline-flex items-center border-2 border-grafito px-4 py-2 font-titulo text-[2rem] leading-none font-bold tracking-[-0.02em] text-grafito">
              {BRAND.nameUpper}
            </span>
          </div>
          <div className="carga__boquilla absolute inset-0 border-t-2 border-grafito" />
        </div>

        {/* Avance de la impresión, en Grafito (§4.1 regla 3) */}
        <div className="mt-6 h-px w-full bg-cemento">
          <div className="carga__barra h-px w-full bg-grafito" />
        </div>

        <p className="cifra mt-3 text-detalle tracking-wide text-texto-secundario uppercase">
          Imprimiendo
        </p>
      </div>
    </div>
  );
}
