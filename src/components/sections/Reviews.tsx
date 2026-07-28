import { RESENAS } from "@/lib/resenas";

/**
 * §7.1 sección 7 — se renderiza SOLO si hay reseñas reales con nombre.
 * Si el array está vacío, la sección no se monta. No hay estado vacío, no hay
 * "próximamente", no hay relleno: simplemente no existe.
 */
export function Reviews() {
  const reales = RESENAS.filter((r) => r.nombre.trim().length > 0);
  if (reales.length === 0) return null;

  return (
    <section className="contenido bajo-fold py-20" aria-labelledby="resenas">
      <h2 id="resenas" className="font-titulo text-h2">
        Lo que dicen quienes ya compraron
      </h2>

      <ul className="mt-10 grid gap-px border border-cemento bg-cemento md:grid-cols-2">
        {reales.map((r) => (
          <li key={`${r.nombre}-${r.fecha}`} className="bg-hueso p-8">
            <blockquote className="medida text-grafito">{r.texto}</blockquote>
            <p className="mt-4 font-titulo text-detalle font-semibold text-grafito">
              {r.nombre}
              {r.ciudad && (
                <span className="font-normal text-texto-secundario">
                  {" "}
                  · {r.ciudad}
                </span>
              )}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
