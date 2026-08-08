"use client";

import Link from "next/link";
import { useState } from "react";

import { precioMXN, PRODUCTOS } from "@/lib/productos";
import { waLink } from "@/lib/brand";
import { trackContact } from "@/lib/pixel";
import {
  ACABADOS_CALCULADORA,
  COMPLEJIDADES_CALCULADORA,
  estimarLote,
  estimarMedida,
  LIMITES_MEDIDA,
  MATERIALES_CALCULADORA,
  RANGO_CATALOGO,
  RANGO_LOTE,
  RANGO_MEDIDA,
  RELLENOS_CALCULADORA,
  TAMANOS_LOTE,
  type AcabadoCalculadora,
  type ComplejidadCalculadora,
  type MaterialCalculadora,
  type RellenoCalculadora,
  type TamanoLote,
} from "@/lib/presupuesto";

/* ============================================================================
   Calculadora de presupuesto — componente interactivo.

   Tres modos que replican las ramas del formulario de cotización (§7.2):
   catálogo (precio publicado), a medida (estimación por volumen y tiempo) y
   lote (descuento por volumen). Todo el cálculo vive en src/lib/presupuesto.ts
   y es 100% local: no sale nada del navegador hasta que la persona decide
   cotizar de verdad.
   ========================================================================= */

type Modo = "catalogo" | "medida" | "lote";

const MODOS: ReadonlyArray<{ valor: Modo; etiqueta: string; ayuda: string }> = [
  {
    valor: "catalogo",
    etiqueta: "Del catálogo",
    ayuda: "Precio publicado, no necesita cotización.",
  },
  {
    valor: "medida",
    etiqueta: "A medida",
    ayuda: "Tú traes el archivo o yo lo diseño.",
  },
  {
    valor: "lote",
    etiqueta: "Un lote",
    ayuda: "De 50 a 200 piezas para un evento.",
  },
] as const;

/** Radio group en rejilla de esquinas rectas (mismo patrón que el formulario). */
function GrupoOpciones<T extends string>({
  nombre,
  etiqueta,
  opciones,
  valor,
  onChange,
  columnas = 3,
}: {
  nombre: string;
  etiqueta: string;
  opciones: ReadonlyArray<{ valor: T; etiqueta: string; ayuda?: string }>;
  valor: T;
  onChange: (v: T) => void;
  columnas?: number;
}) {
  return (
    <fieldset>
      <legend className="font-titulo text-detalle font-semibold text-grafito">
        {etiqueta}
      </legend>
      <div
        className={`mt-3 grid gap-px border border-texto-secundario bg-texto-secundario sm:grid-cols-${columnas}`}
      >
        {opciones.map((o) => (
          <label
            key={o.valor}
            className="flex min-h-[44px] cursor-pointer items-center gap-3 bg-hueso px-4 py-3 text-detalle"
          >
            <input
              type="radio"
              name={nombre}
              value={o.valor}
              checked={valor === o.valor}
              onChange={() => onChange(o.valor)}
              className="size-4 accent-grafito"
            />
            <span>
              {o.etiqueta}
              {o.ayuda ? (
                <span className="block text-detalle text-texto-secundario">
                  {o.ayuda}
                </span>
              ) : null}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Botón principal — mismo estilo que el CTA del formulario. */
function Cta({
  href,
  children,
  onTrack,
}: {
  href: string;
  children: React.ReactNode;
  onTrack?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onTrack}
      className="inline-flex min-h-[44px] items-center justify-center bg-grafito px-6 py-3 font-titulo text-detalle font-semibold text-hueso"
    >
      {children}
    </Link>
  );
}

function CampoMedida({
  id,
  etiqueta,
  valor,
  onChange,
  max,
}: {
  id: string;
  etiqueta: string;
  valor: number;
  onChange: (v: number) => void;
  max: number;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="font-titulo text-detalle font-semibold text-grafito">
        {etiqueta}
      </span>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={0.5}
        max={max}
        step={0.5}
        value={valor}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 block w-full border border-texto-secundario bg-hueso px-4 py-3 text-cuerpo text-grafito focus-visible:outline-2 focus-visible:outline-grafito"
      />
    </label>
  );
}

export function CalculadoraPresupuesto() {
  const [modo, setModo] = useState<Modo>("medida");

  // Rama catálogo
  const [productoId, setProductoId] = useState(PRODUCTOS[0].id);

  // Rama a medida
  const [largo, setLargo] = useState(8);
  const [ancho, setAncho] = useState(6);
  const [alto, setAlto] = useState(5);
  const [material, setMaterial] = useState<MaterialCalculadora>("PLA");
  const [relleno, setRelleno] = useState<RellenoCalculadora>("normal");
  const [complejidad, setComplejidad] = useState<ComplejidadCalculadora>("media");
  const [acabado, setAcabado] = useState<AcabadoCalculadora>("estandar");
  const [cantidad, setCantidad] = useState(1);
  const [traeArchivo, setTraeArchivo] = useState(false);

  // Rama lote
  const [tamanoLote, setTamanoLote] = useState<TamanoLote>("mediana");
  const [cantidadLote, setCantidadLote] = useState(100);

  const producto = PRODUCTOS.find((p) => p.id === productoId) ?? PRODUCTOS[0];
  const estimacion = estimarMedida({
    largo,
    ancho,
    alto,
    material,
    relleno,
    complejidad,
    acabado,
    cantidad,
    traeArchivo,
  });
  const lote = estimarLote({ tamano: tamanoLote, cantidad: cantidadLote });

  const fueraDeLimites =
    largo > LIMITES_MEDIDA.largo ||
    ancho > LIMITES_MEDIDA.ancho ||
    alto > LIMITES_MEDIDA.alto;

  const mensajeWhatsApp = (() => {
    if (modo === "catalogo") {
      return waLink(
        `Hola, me interesa "${producto.nombre}" del catálogo (${precioMXN(
          producto.precio,
        )}). ¿Está disponible?`,
      );
    }
    if (modo === "lote") {
      return waLink(
        `Hola, vengo de la calculadora: un lote de ${lote.cantidad} piezas tamaño ${tamanoLote}. El estimado fue ${precioMXN(
          lote.precioTotal,
        )}. ¿Me confirmas?`,
      );
    }
    return waLink(
      `Hola, vengo de la calculadora: una pieza a medida de ${largo} × ${ancho} × ${alto} cm en ${material}, x${cantidad}. El estimado fue ${precioMXN(
        estimacion.precioMedio,
      )}. ¿Me confirmas el precio?`,
    );
  })();

  return (
    <div className="space-y-10">
      {/* ── ¿Qué vas a pedir? ─────────────────────────────────────────── */}
      <GrupoOpciones
        nombre="modo"
        etiqueta="¿Qué vas a pedir?"
        opciones={MODOS}
        valor={modo}
        onChange={setModo}
        columnas={3}
      />

      {/* ── Rama: catálogo ────────────────────────────────────────────── */}
      {modo === "catalogo" && (
        <>
          <fieldset>
            <legend className="font-titulo text-detalle font-semibold text-grafito">
              Elige la pieza
            </legend>
            <div className="mt-3 grid gap-px border border-texto-secundario bg-texto-secundario sm:grid-cols-2">
              {PRODUCTOS.map((p) => (
                <label
                  key={p.id}
                  className="flex min-h-[44px] cursor-pointer items-start gap-3 bg-hueso px-4 py-3 text-detalle"
                >
                  <input
                    type="radio"
                    name="producto"
                    value={p.id}
                    checked={productoId === p.id}
                    onChange={() => setProductoId(p.id)}
                    className="mt-1 size-4 shrink-0 accent-grafito"
                  />
                  <span>
                    <span className="block font-titulo font-semibold text-grafito">
                      {p.nombre}
                    </span>
                    <span className="block text-texto-secundario">
                      {p.medidas} · {p.material}
                    </span>
                  </span>
                  <span className="ml-auto shrink-0 font-titulo font-semibold text-grafito">
                    {precioMXN(p.precio)}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <section
            aria-label="Resultado"
            className="border-2 border-grafito p-6 sm:p-8"
          >
            <p className="text-detalle text-texto-secundario">
              Precio publicado
            </p>
            <p className="mt-2 font-titulo text-h2 text-grafito">
              {precioMXN(producto.precio)}
            </p>
            <p className="mt-2 text-detalle text-texto-secundario">
              {producto.nombre} · {producto.medidas} · {producto.material} ·{" "}
              {producto.descripcion}
            </p>
            <p className="mt-4 border-l-2 border-grafito pl-4 text-detalle text-texto-secundario">
              Precio de referencia dentro del rango publicado del catálogo (
              {precioMXN(RANGO_CATALOGO.min)} a {precioMXN(RANGO_CATALOGO.max)}).
              Confírmame disponibilidad y quedamos.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Cta
                href={mensajeWhatsApp}
                onTrack={() =>
                  trackContact({
                    content_name: "calculadora-catalogo",
                    content_ids: [producto.id],
                    value: producto.precio,
                    currency: "MXN",
                  })
                }
              >
                Pedirla por WhatsApp
              </Cta>
            </div>
          </section>
        </>
      )}

      {/* ── Rama: a medida ────────────────────────────────────────────── */}
      {modo === "medida" && (
        <>
          <GrupoOpciones
            nombre="archivo"
            etiqueta="¿Ya tienes tu archivo 3D (STL o 3MF)?"
            opciones={[
              { valor: "si", etiqueta: "Sí, ya lo tengo", ayuda: "Solo cobro la impresión." },
              { valor: "no", etiqueta: "No, necesito que lo diseñes", ayuda: "El diseño se cobra aparte." },
            ]}
            valor={traeArchivo ? "si" : "no"}
            onChange={(v) => setTraeArchivo(v === "si")}
            columnas={2}
          />

          <fieldset>
            <legend className="font-titulo text-detalle font-semibold text-grafito">
              Medidas aproximadas de la pieza (cm)
            </legend>
            <p className="mt-2 text-detalle text-texto-secundario">
              Máximo en una sola impresión: {LIMITES_MEDIDA.largo} ×{" "}
              {LIMITES_MEDIDA.ancho} × {LIMITES_MEDIDA.alto} cm. Si es más
              grande, se fabrica en partes y se ensambla.
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <CampoMedida
                id="med-largo"
                etiqueta="Largo"
                valor={largo}
                onChange={setLargo}
                max={LIMITES_MEDIDA.largo}
              />
              <CampoMedida
                id="med-ancho"
                etiqueta="Ancho"
                valor={ancho}
                onChange={setAncho}
                max={LIMITES_MEDIDA.ancho}
              />
              <CampoMedida
                id="med-alto"
                etiqueta="Alto"
                valor={alto}
                onChange={setAlto}
                max={LIMITES_MEDIDA.alto}
              />
            </div>
          </fieldset>

          <GrupoOpciones
            nombre="material"
            etiqueta="Material"
            opciones={MATERIALES_CALCULADORA.map((m) => ({
              valor: m.valor,
              etiqueta: m.etiqueta,
            }))}
            valor={material}
            onChange={setMaterial}
          />

          <GrupoOpciones
            nombre="relleno"
            etiqueta="Relleno (resistencia)"
            opciones={RELLENOS_CALCULADORA.map((r) => ({
              valor: r.valor,
              etiqueta: r.etiqueta,
            }))}
            valor={relleno}
            onChange={setRelleno}
          />

          <GrupoOpciones
            nombre="complejidad"
            etiqueta="Complejidad de la pieza"
            opciones={COMPLEJIDADES_CALCULADORA.map((c) => ({
              valor: c.valor,
              etiqueta: c.etiqueta,
            }))}
            valor={complejidad}
            onChange={setComplejidad}
          />

          <GrupoOpciones
            nombre="acabado"
            etiqueta="Acabado"
            opciones={ACABADOS_CALCULADORA.map((a) => ({
              valor: a.valor,
              etiqueta: a.etiqueta,
            }))}
            valor={acabado}
            onChange={setAcabado}
          />

          <fieldset>
            <legend className="font-titulo text-detalle font-semibold text-grafito">
              Cantidad
            </legend>
            <div className="mt-3 flex items-center gap-4">
              <button
                type="button"
                aria-label="Menos piezas"
                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                className="flex h-11 w-11 items-center justify-center border border-texto-secundario bg-hueso font-titulo text-cuerpo text-grafito"
              >
                −
              </button>
              <span className="font-titulo text-h3 text-grafito" aria-live="polite">
                {cantidad}
              </span>
              <button
                type="button"
                aria-label="Más piezas"
                onClick={() => setCantidad((c) => Math.min(10, c + 1))}
                className="flex h-11 w-11 items-center justify-center border border-texto-secundario bg-hueso font-titulo text-cuerpo text-grafito"
              >
                +
              </button>
              <span className="text-detalle text-texto-secundario">
                La preparación y el diseño se cobran una sola vez.
              </span>
            </div>
          </fieldset>

          <section
            aria-label="Resultado"
            className="border-2 border-grafito p-6 sm:p-8"
          >
            {fueraDeLimites ? (
              <p className="border-l-2 border-grafito pl-4 font-titulo font-semibold text-grafito">
                Una pieza de más de {LIMITES_MEDIDA.largo} ×{" "}
                {LIMITES_MEDIDA.ancho} × {LIMITES_MEDIDA.alto} cm no entra en
                una sola impresión: se fabrica en partes y se ensambla. El
                estimado de abajo es orientativo.
              </p>
            ) : null}

            {estimacion.volumenCaja <= 0 ? (
              <p className="font-titulo font-semibold text-grafito">
                Pon las medidas aproximadas para estimar el precio.
              </p>
            ) : (
              <>
                <p className="text-detalle text-texto-secundario">
                  Estimación orientativa
                  {cantidad > 1 ? ` · ${cantidad} piezas` : ""}
                </p>
                {estimacion.sobreMaximo ? (
                  <>
                    <p className="mt-2 font-titulo text-h2 text-grafito">
                      Más de {precioMXN(RANGO_MEDIDA.max)}
                    </p>
                    <p className="mt-2 text-detalle text-texto-secundario">
                      La estimación bruta es de ~
                      {precioMXN(estimacion.costoBruto)}. Por tamaño, material
                      o relleno sale del rango típico de una pieza a medida (
                      {precioMXN(RANGO_MEDIDA.min)} a{" "}
                      {precioMXN(RANGO_MEDIDA.max)}). Cotiza para el precio
                      real: a veces se abarata bajando relleno o partiendo la
                      pieza.
                    </p>
                  </>
                ) : estimacion.bajoMinimo ? (
                  <>
                    <p className="mt-2 font-titulo text-h2 text-grafito">
                      Desde {precioMXN(RANGO_MEDIDA.min)}
                    </p>
                    <p className="mt-2 text-detalle text-texto-secundario">
                      La estimación bruta es de ~
                      {precioMXN(estimacion.costoBruto)}. El mínimo del taller
                      cubre la preparación y el arranque de la impresora.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mt-2 font-titulo text-h2 text-grafito">
                      Entre {precioMXN(estimacion.precioMin)} y{" "}
                      {precioMXN(estimacion.precioMax)}
                    </p>
                    <p className="mt-2 text-detalle text-texto-secundario">
                      Punto medio: ~{precioMXN(estimacion.precioMedio)}.
                    </p>
                  </>
                )}

                <dl className="mt-6 grid gap-x-8 gap-y-2 text-detalle text-texto-secundario sm:grid-cols-3">
                  <div className="flex gap-2">
                    <dt className="font-semibold text-grafito">Peso:</dt>
                    <dd>
                      ~{Math.max(1, Math.round(estimacion.gramos))} g
                      {cantidad > 1 ? " por pieza" : ""}
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-semibold text-grafito">Impresión:</dt>
                    <dd>
                      ~{Math.max(0.5, Math.round(estimacion.horas * 10) / 10)} h
                      {cantidad > 1 ? " en total" : ""}
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-semibold text-grafito">Incluye:</dt>
                    <dd>
                      {traeArchivo ? "impresión" : "diseño + impresión"}
                    </dd>
                  </div>
                </dl>

                <p className="mt-6 border-l-2 border-grafito pl-4 text-detalle text-texto-secundario">
                  Esto es un estimado en segundos, no una cotización. El precio
                  exacto se confirma gratis y se responde el mismo día; el
                  envío se suma aparte.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Cta
                    href="/cotiza"
                    onTrack={() =>
                      trackContact({
                        content_name: "calculadora-medida-cotiza",
                        value: estimacion.precioMedio,
                        currency: "MXN",
                      })
                    }
                  >
                    Cotizar esta pieza
                  </Cta>
                  <Cta
                    href={mensajeWhatsApp}
                    onTrack={() =>
                      trackContact({
                        content_name: "calculadora-medida-whatsapp",
                        value: estimacion.precioMedio,
                        currency: "MXN",
                      })
                    }
                  >
                    Cotizar por WhatsApp
                  </Cta>
                </div>
              </>
            )}
          </section>
        </>
      )}

      {/* ── Rama: lote ────────────────────────────────────────────────── */}
      {modo === "lote" && (
        <>
          <GrupoOpciones
            nombre="tamano-lote"
            etiqueta="¿Qué tan grande es la pieza del lote?"
            opciones={TAMANOS_LOTE.map((t) => ({
              valor: t.valor,
              etiqueta: t.etiqueta,
            }))}
            valor={tamanoLote}
            onChange={setTamanoLote}
          />

          <fieldset>
            <legend className="font-titulo text-detalle font-semibold text-grafito">
              Cantidad de piezas
            </legend>
            <div className="mt-3 flex flex-wrap items-center gap-6">
              <input
                type="range"
                min={50}
                max={200}
                step={5}
                value={cantidadLote}
                onChange={(e) => setCantidadLote(Number(e.target.value))}
                className="h-2 w-full max-w-sm cursor-pointer accent-grafito sm:w-72"
                aria-label="Cantidad de piezas del lote"
              />
              <span
                className="font-titulo text-h3 text-grafito"
                aria-live="polite"
              >
                {cantidadLote} piezas
              </span>
            </div>
            <p className="mt-2 text-detalle text-texto-secundario">
              El precio por pieza baja con la cantidad: se amortiza el diseño y
              la preparación.
            </p>
          </fieldset>

          <section
            aria-label="Resultado"
            className="border-2 border-grafito p-6 sm:p-8"
          >
            <p className="text-detalle text-texto-secundario">
              Estimación orientativa · lote de {lote.cantidad} piezas
            </p>
            {lote.sobreMaximo ? (
              <>
                <p className="mt-2 font-titulo text-h2 text-grafito">
                  Más de {precioMXN(RANGO_LOTE.max)}
                </p>
                <p className="mt-2 text-detalle text-texto-secundario">
                  La estimación bruta supera el rango publicado de lotes (
                  {precioMXN(RANGO_LOTE.min)} a {precioMXN(RANGO_LOTE.max)}).
                  Cotiza para el precio real: en lotes grandes siempre hay
                  margen de negociación.
                </p>
              </>
            ) : (
              <>
                <p className="mt-2 font-titulo text-h2 text-grafito">
                  {precioMXN(lote.precioTotal)}
                </p>
                <p className="mt-2 text-detalle text-texto-secundario">
                  ≈ {precioMXN(lote.porPieza)} por pieza, dentro del rango
                  publicado de lotes ({precioMXN(RANGO_LOTE.min)} a{" "}
                  {precioMXN(RANGO_LOTE.max)}).
                </p>
              </>
            )}
            <p className="mt-6 border-l-2 border-grafito pl-4 text-detalle text-texto-secundario">
              El precio incluye el diseño de la pieza y la personalización
              (texto, fechas o logos). El envío se suma aparte. La cotización
              final es gratis y sin compromiso.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Cta
                href="/cotiza"
                onTrack={() =>
                  trackContact({
                    content_name: "calculadora-lote-cotiza",
                    value: lote.precioTotal,
                    currency: "MXN",
                  })
                }
              >
                Cotizar este lote
              </Cta>
              <Cta
                href={mensajeWhatsApp}
                onTrack={() =>
                  trackContact({
                    content_name: "calculadora-lote-whatsapp",
                    value: lote.precioTotal,
                    currency: "MXN",
                  })
                }
              >
                Cotizar por WhatsApp
              </Cta>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
