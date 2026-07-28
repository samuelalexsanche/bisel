"use client";

import { AlertCircle, CheckCircle2, Paperclip } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BRAND, waLink } from "@/lib/brand";
import {
  MAX_ARCHIVOS,
  MAX_BYTES,
  PLAZOS,
  REGLAS,
  USOS,
  type Cotizacion,
} from "@/lib/cotizacion";
import { TRAZO } from "@/lib/iconos";
import { enviarCotizacion, type ResultadoEnvio } from "@/lib/envio";

export function FormularioCotizacion() {
  const [resultado, setResultado] = useState<ResultadoEnvio | null>(null);
  const [archivos, setArchivos] = useState<File[]>([]);
  const [errorArchivos, setErrorArchivos] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const form = useForm<Cotizacion>({
    // Validar al salir del campo, no en cada tecla: el error aparece cuando la
    // persona terminó de escribir, no mientras escribe.
    mode: "onBlur",
    defaultValues: {
      descripcion: "",
      medidas: "",
      uso: "",
      plazo: "",
      nombre: "",
      contacto: "",
    },
  });

  function onArchivos(e: React.ChangeEvent<HTMLInputElement>) {
    const lista = Array.from(e.target.files ?? []);
    setErrorArchivos(null);

    if (lista.length > MAX_ARCHIVOS) {
      setErrorArchivos(`Máximo ${MAX_ARCHIVOS} archivos.`);
      e.target.value = "";
      setArchivos([]);
      return;
    }
    const total = lista.reduce((s, f) => s + f.size, 0);
    if (total > MAX_BYTES) {
      setErrorArchivos("Entre todas las fotos no deben pasar de 10 MB.");
      e.target.value = "";
      setArchivos([]);
      return;
    }
    setArchivos(lista);
  }

  async function onSubmit(valores: Cotizacion) {
    setResultado(await enviarCotizacion(valores));
  }

  // Llevar el foco al aviso para que un lector de pantalla lo anuncie.
  // Va en un efecto y no dentro de onSubmit: el panel todavía no existe en el
  // DOM cuando la acción responde, y leer el ref durante el render es un error.
  useEffect(() => {
    if (resultado) panelRef.current?.focus();
  }, [resultado]);

  /* ── Estado de éxito, en la misma página y sin redirección (§7.2) ── */
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="descripcion"
          rules={REGLAS.descripcion}
          render={({ field }) => (
            <FormItem>
              <FormLabel>¿Qué pieza necesitas?</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Se rompió la perilla del horno. Es redonda, con un eje cuadrado por dentro."
                />
              </FormControl>
              <FormDescription>
                Dime qué es, de qué aparato salió y para qué la usas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Adjuntos — §7.2: máximo 3 archivos, 10 MB. */}
        <div>
          <label
            htmlFor="archivos"
            className="font-titulo text-detalle font-semibold text-grafito"
          >
            Foto o boceto
          </label>
          <div className="mt-2">
            <input
              id="archivos"
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={onArchivos}
              aria-describedby="archivos-ayuda archivos-error"
              className="block w-full border border-texto-secundario bg-transparent px-3 py-3 text-detalle file:mr-4 file:border-0 file:bg-cemento file:px-4 file:py-2 file:font-titulo file:text-detalle file:font-semibold file:text-grafito"
            />
          </div>
          <p
            id="archivos-ayuda"
            className="mt-2 text-detalle text-texto-secundario"
          >
            Hasta {MAX_ARCHIVOS} archivos, 10 MB entre todos. Una foto de la
            pieza rota ayuda más que cualquier descripción.
          </p>
          {archivos.length > 0 && (
            <ul className="mt-2 space-y-1">
              {archivos.map((a) => (
                <li
                  key={a.name}
                  className="flex items-center gap-2 text-detalle text-grafito"
                >
                  <Paperclip size={15} strokeWidth={TRAZO} aria-hidden="true" />
                  {a.name}
                </li>
              ))}
            </ul>
          )}
          {/* El error no se señala solo con color: lleva icono y texto (§6). */}
          <p
            id="archivos-error"
            role={errorArchivos ? "alert" : undefined}
            className="mt-2 flex items-center gap-2 text-detalle text-arcilla-oscura"
          >
            {errorArchivos && (
              <>
                <AlertCircle size={15} strokeWidth={TRAZO} aria-hidden="true" />
                {errorArchivos}
              </>
            )}
          </p>
        </div>

        <FormField
          control={form.control}
          name="medidas"
          rules={REGLAS.medidas}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medidas aproximadas</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="4 cm de diámetro, 2 cm de alto"
                />
              </FormControl>
              <FormDescription>
                Con una regla basta. Si te equivocas por poco, lo ajustamos.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Radios en lugar de <select>: cuatro opciones se leen de un vistazo
            y cada una es un objetivo de toque de 44px. */}
        <FormField
          control={form.control}
          name="uso"
          rules={REGLAS.uso}
          render={({ field }) => (
            <FormItem>
              <fieldset>
                <legend className="font-titulo text-detalle font-semibold text-grafito">
                  ¿Dónde va a estar?
                </legend>
                <div className="mt-3 grid gap-px border border-texto-secundario bg-texto-secundario sm:grid-cols-2">
                  {USOS.map((u) => (
                    <label
                      key={u.valor}
                      className="flex min-h-[44px] cursor-pointer items-center gap-3 bg-hueso px-4 py-3 text-detalle"
                    >
                      <input
                        type="radio"
                        name={field.name}
                        value={u.valor}
                        checked={field.value === u.valor}
                        onChange={() => field.onChange(u.valor)}
                        onBlur={field.onBlur}
                        className="size-4 accent-grafito"
                      />
                      {u.etiqueta}
                    </label>
                  ))}
                </div>
              </fieldset>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="plazo"
          rules={REGLAS.plazo}
          render={({ field }) => (
            <FormItem>
              <fieldset>
                <legend className="font-titulo text-detalle font-semibold text-grafito">
                  ¿Para cuándo?
                </legend>
                <div className="mt-3 grid gap-px border border-texto-secundario bg-texto-secundario sm:grid-cols-3">
                  {PLAZOS.map((p) => (
                    <label
                      key={p.valor}
                      className="flex min-h-[44px] cursor-pointer items-center gap-3 bg-hueso px-4 py-3 text-detalle"
                    >
                      <input
                        type="radio"
                        name={field.name}
                        value={p.valor}
                        checked={field.value === p.valor}
                        onChange={() => field.onChange(p.valor)}
                        onBlur={field.onBlur}
                        className="size-4 accent-grafito"
                      />
                      {p.etiqueta}
                    </label>
                  ))}
                </div>
              </fieldset>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-8 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="nombre"
            rules={REGLAS.nombre}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tu nombre</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contacto"
            rules={REGLAS.contacto}
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp o correo</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="email"
                    autoComplete="email tel"
                    placeholder="33 1234 5678"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Aviso de envío no configurado o error de red. */}
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
                <AlertCircle size={20} strokeWidth={TRAZO} aria-hidden="true" />
                Todavía no puedo recibir el formulario
              </p>
              <p className="medida mt-2 text-detalle text-grafito">
                {resultado.estado === "error"
                  ? resultado.mensaje
                  : "El envío del formulario aún no está conectado. Mándame lo mismo por WhatsApp y te contesto igual de rápido — ahí también me puedes pasar la foto."}
              </p>
              <div className="mt-4">
                <Button asChild variant="default">
                  <a
                    href={waLink(
                      `Hola, quiero cotizar una pieza con ${BRAND.name}. ${form.getValues("descripcion")}`.trim(),
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

        <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Mandando…" : "Mandar cotización"}
        </Button>
      </form>
    </Form>
  );
}
