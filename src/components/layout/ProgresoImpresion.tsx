/* 41 capas: de la 000 a la 040, las mismas 40 bandas de <PrintReveal>. */
const CAPAS = Array.from({ length: 41 }, (_, i) => String(i).padStart(3, "0"));

/**
 * Progreso de impresión ligado al scroll — §4.1 regla 3.
 *
 * El spec pide explícitamente un indicador de progreso de scroll **en Grafito,
 * no en Arcilla**: si fuera Arcilla consumiría el único acento permitido por
 * vista y el acento dejaría de señalar nada.
 *
 * Aquí ese indicador es literal a la idea del §5.1: la página se imprime
 * conforme bajas, y el contador dice en qué capa vas. La cinta de números sube
 * con `animation-timeline: scroll()`, así que es CSS puro: cero JavaScript,
 * cero listeners de scroll (§5.4.1 y §5.4.3).
 *
 * Decorativo: `aria-hidden`. Quien navega con lector de pantalla ya tiene la
 * posición real del documento y un contador de capas solo sería ruido.
 */
export function ProgresoImpresion() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 left-0 z-40 hidden w-14 select-none md:block"
    >
      {/* Riel */}
      <div className="absolute top-0 bottom-0 left-6 w-px bg-cemento">
        <div className="progreso__barra h-full w-px bg-grafito" />
      </div>

      {/* Contador de capa: ventana de una línea sobre una cinta de 41 */}
      <div className="absolute bottom-8 left-0 w-14">
        {/* `text-detalle` también en la ventana: 1.1em tiene que resolverse
            contra el MISMO tamaño de fuente que las filas, o la ventana queda
            más alta que un número y asoma el siguiente. */}
        <div className="mx-auto h-[1.1em] overflow-hidden text-center text-detalle">
          <div className="contador__cinta">
            {CAPAS.map((n) => (
              <div
                key={n}
                className="cifra h-[1.1em] text-detalle leading-[1.1em] text-grafito"
              >
                {n}
              </div>
            ))}
          </div>
        </div>
        <p className="cifra mt-1 text-center text-[0.625rem] tracking-wider text-texto-secundario uppercase">
          capa
        </p>
      </div>
    </div>
  );
}
