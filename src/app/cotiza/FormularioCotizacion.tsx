"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch, type UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BRAND, waLink } from "@/lib/brand";
import {
  alcanzaLaFecha,
  CAMPOS_POR_TIPO,
  MATERIALES,
  PLAZOS,
  REGLAS,
  RELLENOS,
  TIPOS_PEDIDO,
  USOS,
  type Cotizacion,
  type TipoPedido,
} from "@/lib/cotizacion";
import { TRAZO } from "@/lib/iconos";
import { enviarCotizacion, type ResultadoEnvio } from "@/lib/envio";
import { trackLead } from "@/lib/pixel";

type Campo = keyof Cotizacion;
type Formulario = UseFormReturn<Cotizacion>;

/* ── Piezas de formulario ───────────────────────────────────────────────── */

function Etiqueta({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={id}
      className="font-titulo text-detalle font-semibold text-grafito"
    >
      {children}
    </label>
  );
}

/* El error nunca se señala solo con color: lleva icono y texto (§6). */
function Error({ id, mensaje }: { id: string; mensaje?: string }) {
  if (!mensaje) return null;
  return (
    <p
      id={id}
      role="alert"
      className="mt-2 flex items-center gap-2 text-detalle text-arcilla-oscura"
    >
      <AlertCircle size={15} strokeWidth={TRAZO} aria-hidden="true" />
      {mensaje}
    </p>
  );
}

function CampoTexto({
  form,
  campo,
  etiqueta,
  ayuda,
  placeholder,
  tipo = "text",
  area = false,
}: {
  form: Formulario;
  campo: Campo;
  etiqueta: string;
  ayuda?: string;
  placeholder?: string;
  tipo?: string;
  area?: boolean;
}) {
  const id = `c-${campo}`;
  const error = form.formState.errors[campo]?.message as string | undefined;
  const reglas = REGLAS[campo as keyof typeof REGLAS] ?? {};
  const Control = area ? Textarea : Input;

  return (
    <div>
      <Etiqueta id={id}>{etiqueta}</Etiqueta>
      <div className="mt-2">
        <Control
          id={id}
          type={area ? undefined : tipo}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [ayuda ? `${id}-ayuda` : null, error ? `${id}-error` : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          {...form.register(campo, reglas)}
        />
      </div>
      {ayuda && (
        <p
          id={`${id}-ayuda`}
          className="mt-2 text-detalle text-texto-secundario"
        >
          {ayuda}
        </p>
      )}
      <Error id={`${id}-error`} mensaje={error} />
    </div>
  );
}

/* Radios en vez de <select>: se leen de un vistazo y cada uno es un objetivo
   de toque de 44px (§6). */
function CampoOpciones({
  form,
  campo,
  etiqueta,
  opciones,
  columnas = 2,
}: {
  form: Formulario;
  campo: Campo;
  etiqueta: string;
  opciones: ReadonlyArray<{ valor: string; etiqueta: string }>;
  columnas?: number;
}) {
  const error = form.formState.errors[campo]?.message as string | undefined;
  const reglas = REGLAS[campo as keyof typeof REGLAS] ?? {};

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
              value={o.valor}
              className="size-4 accent-grafito"
              {...form.register(campo, reglas)}
            />
            {o.etiqueta}
          </label>
        ))}
      </div>
      <Error id={`c-${campo}-error`} mensaje={error} />
    </fieldset>
  );
}

/* ── El formulario ──────────────────────────────────────────────────────── */

export function FormularioCotizacion() {
  const [tipo, setTipo] = useState<TipoPedido | null>(null);
  const [resultado, setResultado] = useState<ResultadoEnvio | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const form = useForm<Cotizacion>({
    // Validar al salir del campo, no en cada tecla: el error aparece cuando la
    // persona terminó de escribir, no mientras escribe.
    mode: "onBlur",
    defaultValues: { nombre: "", contacto: "" },
  });

  /* `useWatch` en vez de `form.watch()`: es la API pensada para suscribirse a
     un campo y no rompe la memoización del compilador de React. */
  const fechaEvento = useWatch({ control: form.control, name: "fechaEvento" });
  const aviso = tipo ? alcanzaLaFecha(tipo, fechaEvento ?? "") : null;

  useEffect(() => {
    if (resultado) panelRef.current?.focus();
  }, [resultado]);

  /* Llegar desde una ficha del catálogo con la rama y la pieza ya elegidas.
     Quien viene de una ficha no debería reescribir cuál pieza quiere.

     Se lee de `location` y no con `useSearchParams` porque ese hook obliga a
     envolver la página en Suspense y aquí no aporta nada: el sitio es un
     export estático y los parámetros solo existen en el navegador.

     El efecto es el sitio correcto para esto — la URL es un sistema externo
     que no existe al renderizar en el servidor — y por eso no se puede
     derivar en el estado inicial sin provocar un desajuste de hidratación.
     Corre una sola vez, protegido por el ref. */
  const yaLeidoUrl = useRef(false);
  useEffect(() => {
    if (yaLeidoUrl.current) return;
    yaLeidoUrl.current = true;

    const params = new URLSearchParams(window.location.search);
    const t = params.get("tipo");
    if (!t || !TIPOS_PEDIDO.some((x) => x.valor === t)) return;

    const tipoUrl = t as TipoPedido;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- ver arriba: la URL solo existe tras montar
    setTipo(tipoUrl);
    form.setValue("tipo", tipoUrl);

    for (const campo of ["producto", "modelo"] as const) {
      const valor = params.get(campo);
      if (valor) form.setValue(campo, valor);
    }
  }, [form]);

  function elegirTipo(t: TipoPedido) {
    setTipo(t);
    form.setValue("tipo", t);
    form.clearErrors();
  }

  async function onSubmit(valores: Cotizacion) {
    const r = await enviarCotizacion(valores);
    setResultado(r);
    // Lead = la conversión del negocio: una cotización llegó al taller (§14.7).
    if (r.estado === "ok") {
      trackLead({ tipo: valores.tipo, content_name: "cotizacion" });
    }
  }

  const campos = tipo ? CAMPOS_POR_TIPO[tipo] : [];
  const muestra = (c: Campo) => campos.includes(c);

  /* ── Éxito, en la misma página y sin redirección (§7.2) ── */
  if (resultado?.estado === "ok") {
    return (
      <div
        ref={panelRef}
        tabIndex={-1}
        role="status"
        className="border-2 border-grafito p-8"
      >
        <CheckCircle2
          size={28}
          strokeWidth={TRAZO}
          aria-hidden="true"
          className="text-grafito"
        />
        <h2 className="mt-4 font-titulo text-h3">Ya me llegó.</h2>
        <p className="medida mt-3 text-texto-secundario">
          Te contesto por WhatsApp con precio, material recomendado y fecha de
          entrega. Si lo mandaste después de las 7 pm, te respondo mañana por la
          mañana.
        </p>
        <dl className="mt-6 space-y-1 text-detalle text-texto-secundario">
          <div className="flex gap-2">
            <dt className="font-semibold text-grafito">A nombre de:</dt>
            <dd>{form.getValues("nombre")}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-semibold text-grafito">Te contesto en:</dt>
            <dd>{form.getValues("contacto")}</dd>
          </div>
        </dl>
      </div>
    );
  }

  return (
    <>
      {/* Criterio 10 — sin JavaScript las ramas no funcionan, así que se
          ofrece el canal real del taller en vez de un formulario muerto. */}
      <noscript>
        <div className="mb-8 border-2 border-grafito bg-arcilla-suave p-6">
          <p className="font-titulo font-semibold text-grafito">
            El formulario necesita JavaScript
          </p>
          <p className="medida mt-2 text-detalle text-grafito">
            Escríbeme por WhatsApp con lo que necesitas y te contesto igual de
            rápido. Ahí también me puedes mandar la foto.
          </p>
          <p className="mt-4">
            <a
              href={waLink(`Hola, quiero cotizar una pieza con ${BRAND.name}.`)}
              className="inline-flex min-h-[44px] items-center bg-grafito px-6 py-3 font-titulo text-detalle font-semibold text-hueso"
            >
              Escribir por WhatsApp
            </a>
          </p>
        </div>
      </noscript>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-10"
      >
        {/* ── Paso 1 · qué tipo de pedido ── */}
        <fieldset>
          <legend className="font-titulo text-h3">¿Qué necesitas?</legend>
          <p className="medida mt-2 text-detalle text-texto-secundario">
            Según lo que elijas te pido solo los datos que hacen falta.
          </p>

          <div className="mt-5 grid gap-px border border-texto-secundario bg-texto-secundario">
            {TIPOS_PEDIDO.map((t) => (
              <label
                key={t.valor}
                className="flex cursor-pointer items-start gap-3 bg-hueso px-5 py-4"
              >
                <input
                  type="radio"
                  name="tipo-pedido"
                  value={t.valor}
                  checked={tipo === t.valor}
                  onChange={() => elegirTipo(t.valor)}
                  className="mt-1 size-4 shrink-0 accent-grafito"
                />
                <span>
                  <span className="block font-titulo text-detalle font-semibold text-grafito">
                    {t.etiqueta}
                  </span>
                  <span className="block text-detalle text-texto-secundario">
                    {t.ayuda}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* ── Paso 2 · los campos de la rama elegida ── */}
        {tipo && (
          <div className="space-y-8 border-t-2 border-grafito pt-10">
            {muestra("producto") && (
              <CampoTexto
                form={form}
                campo="producto"
                etiqueta="¿Cuál pieza?"
                placeholder="Organizador de escritorio"
                ayuda="El nombre como aparece en el catálogo."
              />
            )}

            {muestra("modelo") && (
              <CampoTexto
                form={form}
                campo="modelo"
                etiqueta="¿Cuál modelo?"
                placeholder="Nombre del modelo o su enlace"
                ayuda="El diseño es gratis: lo que cobro es la impresión."
              />
            )}

            {muestra("material") && (
              <CampoOpciones
                form={form}
                campo="material"
                etiqueta="Material"
                opciones={MATERIALES}
              />
            )}

            {muestra("relleno") && (
              <CampoOpciones
                form={form}
                campo="relleno"
                etiqueta="¿Qué tan resistente?"
                opciones={RELLENOS}
                columnas={3}
              />
            )}

            {muestra("color") && (
              <CampoTexto
                form={form}
                campo="color"
                etiqueta="Color (opcional)"
                placeholder="Hueso, gris, negro…"
                ayuda="Si no lo pones, te digo qué tengo disponible."
              />
            )}

            {muestra("escala") && (
              <CampoTexto
                form={form}
                campo="escala"
                etiqueta="Escala (opcional)"
                placeholder="100%"
                ayuda="Déjalo vacío para el tamaño original del modelo."
              />
            )}

            {muestra("acabado") && (
              <CampoTexto
                form={form}
                campo="acabado"
                etiqueta="Acabado (opcional)"
                placeholder="Tal cual sale, lijado…"
              />
            )}

            {muestra("cantidad") && (
              <CampoTexto
                form={form}
                campo="cantidad"
                etiqueta="¿Cuántas?"
                tipo="number"
                placeholder="1"
              />
            )}

            {muestra("descripcion") && (
              <CampoTexto
                form={form}
                campo="descripcion"
                etiqueta="¿Qué pieza necesitas?"
                area
                placeholder="Se rompió la perilla del horno. Es redonda, con un eje cuadrado por dentro."
                ayuda="Dime qué es, de qué aparato salió y para qué la usas."
              />
            )}

            {muestra("medidas") && (
              <CampoTexto
                form={form}
                campo="medidas"
                etiqueta="Medidas aproximadas"
                placeholder="4 cm de diámetro, 2 cm de alto"
                ayuda="Con una regla basta. Si te equivocas por poco, lo ajustamos."
              />
            )}

            {muestra("uso") && (
              <CampoOpciones
                form={form}
                campo="uso"
                etiqueta="¿Dónde va a estar?"
                opciones={USOS}
              />
            )}

            {muestra("fechaEvento") && (
              <div>
                <CampoTexto
                  form={form}
                  campo="fechaEvento"
                  etiqueta="¿Qué día es el evento?"
                  tipo="date"
                  ayuda="Con esto te digo de inmediato si da tiempo."
                />

                {/* La promesa del §7.4 aplicada ANTES de aceptar el pedido:
                    "si no lo puedo hacer, te lo digo". */}
                {aviso && fechaEvento && (
                  <div
                    role="status"
                    className={`mt-3 border-2 p-4 ${
                      aviso.alcanza
                        ? "border-grafito"
                        : "border-arcilla-oscura bg-arcilla-suave"
                    }`}
                  >
                    <p className="flex items-start gap-2 text-detalle text-grafito">
                      {!aviso.alcanza && (
                        <AlertCircle
                          size={16}
                          strokeWidth={TRAZO}
                          aria-hidden="true"
                          className="mt-0.5 shrink-0"
                        />
                      )}
                      <span>
                        {aviso.alcanza ? (
                          <>
                            Sí da tiempo: quedan{" "}
                            <span className="cifra">{aviso.disponibles}</span>{" "}
                            días hábiles y un lote necesita{" "}
                            <span className="cifra">{aviso.necesarios}</span>{" "}
                            contando el envío.
                          </>
                        ) : (
                          <>
                            <strong>Así no llega.</strong> Quedan{" "}
                            <span className="cifra">{aviso.disponibles}</span>{" "}
                            días hábiles y un lote necesita{" "}
                            <span className="cifra">{aviso.necesarios}</span>{" "}
                            contando el envío. Mándalo igual y buscamos una
                            salida: menos piezas, otro material o entrega
                            parcial.
                          </>
                        )}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {muestra("personalizacion") && (
              <CampoTexto
                form={form}
                campo="personalizacion"
                etiqueta="Personalización (opcional)"
                area
                placeholder="Nombres de los novios, logo de la empresa, fecha…"
                ayuda="Si tienes el arte, me lo pasas después por WhatsApp."
              />
            )}

            {muestra("plazo") && (
              <CampoOpciones
                form={form}
                campo="plazo"
                etiqueta="¿Para cuándo?"
                opciones={PLAZOS}
                columnas={3}
              />
            )}

            {/* ── Comunes ── */}
            <div className="grid gap-8 border-t border-cemento pt-8 sm:grid-cols-2">
              <CampoTexto form={form} campo="nombre" etiqueta="Tu nombre" />
              <CampoTexto
                form={form}
                campo="contacto"
                etiqueta="WhatsApp o correo"
                placeholder="33 1234 5678"
              />
            </div>

            {/* Aviso de envío no configurado o error de red */}
            {resultado &&
              (resultado.estado === "sin-destino" ||
                resultado.estado === "error") && (
                <div
                  ref={panelRef}
                  tabIndex={-1}
                  role="alert"
                  className="border-2 border-arcilla-oscura bg-arcilla-suave p-6"
                >
                  <p className="flex items-center gap-2 font-titulo font-semibold text-grafito">
                    <AlertCircle
                      size={20}
                      strokeWidth={TRAZO}
                      aria-hidden="true"
                    />
                    No pude enviar el formulario
                  </p>
                  <p className="medida mt-2 text-detalle text-grafito">
                    {resultado.estado === "error"
                      ? resultado.mensaje
                      : "El envío todavía no está conectado. Mándame lo mismo por WhatsApp y te contesto igual de rápido."}
                  </p>
                  <div className="mt-4">
                    <Button asChild>
                      <a
                        href={waLink(
                          `Hola, quiero cotizar con ${BRAND.name}. ${form.getValues("descripcion") ?? form.getValues("producto") ?? form.getValues("modelo") ?? ""}`.trim(),
                        )}
                        target="_blank"
                        rel="noopener"
                      >
                        Mandarlo por WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              )}

            <Button
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Mandando…" : "Mandar cotización"}
            </Button>
          </div>
        )}
      </form>
    </>
  );
}
