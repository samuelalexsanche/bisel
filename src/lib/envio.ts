import { BRAND } from "./brand";
import {
  CAMPOS_POR_TIPO,
  TIPOS_PEDIDO,
  type Cotizacion,
  type TipoPedido,
} from "./cotizacion";

export type ResultadoEnvio =
  | { estado: "ok" }
  | { estado: "sin-destino" }
  | { estado: "error"; mensaje: string };

/**
 * Clave pública de Web3Forms.
 *
 * Es pública POR DISEÑO: identifica el formulario, no autoriza nada. Web3Forms
 * la publica en el HTML de sus propios ejemplos, así que vivir en el repo no
 * es una fuga. Aun así se lee del entorno para poder cambiarla sin tocar
 * código.
 *
 * PENDIENTE: mientras esté vacía, el formulario NO finge que envía — devuelve
 * `sin-destino` y la interfaz manda a WhatsApp, que es el canal real del
 * negocio. Fingir un éxito perdería clientes de verdad (criterio 12).
 */
const CLAVE_FORMULARIO = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

const ENDPOINT = "https://api.web3forms.com/submit";

/** Etiqueta legible de cada campo, para que el correo se lea solo. */
const ETIQUETAS: Partial<Record<keyof Cotizacion, string>> = {
  producto: "Pieza del catálogo",
  color: "Color",
  modelo: "Modelo",
  escala: "Escala",
  cantidad: "Cantidad",
  material: "Material",
  relleno: "Relleno",
  acabado: "Acabado",
  descripcion: "Qué necesita",
  medidas: "Medidas aproximadas",
  uso: "Dónde va a estar",
  plazo: "Para cuándo",
  fechaEvento: "Fecha del evento",
  personalizacion: "Personalización",
};

const etiquetaTipo = (t: TipoPedido) =>
  TIPOS_PEDIDO.find((x) => x.valor === t)?.etiqueta ?? t;

/**
 * Arma el cuerpo del correo con SOLO los campos de la rama elegida.
 *
 * Mandar los 15 campos con 10 vacíos convierte cada aviso en algo que hay que
 * descifrar. Así el correo se lee de un vistazo y se puede contestar desde el
 * teléfono, que es como opera el taller.
 */
function resumen(datos: Cotizacion): string {
  const lineas: string[] = [`Tipo de pedido: ${etiquetaTipo(datos.tipo)}`, ""];

  for (const campo of CAMPOS_POR_TIPO[datos.tipo]) {
    const valor = datos[campo];
    if (!valor) continue;
    lineas.push(`${ETIQUETAS[campo] ?? campo}: ${valor}`);
  }

  lineas.push("", `Nombre: ${datos.nombre}`, `Contacto: ${datos.contacto}`);
  return lineas.join("\n");
}

/**
 * Envía la cotización.
 *
 * Sin servidor: el POST sale del navegador hacia Web3Forms, que reenvía al
 * correo del taller. Es la vía que ya contemplaba el §7.3 — "este sitio no
 * procesa pagos" — llevada también al formulario.
 */
export async function enviarCotizacion(
  datos: Cotizacion,
): Promise<ResultadoEnvio> {
  if (!CLAVE_FORMULARIO) return { estado: "sin-destino" };

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: CLAVE_FORMULARIO,
        subject: `Cotización — ${etiquetaTipo(datos.tipo)} — ${datos.nombre}`,
        from_name: `${BRAND.name} · cotizaciones`,
        // `replyTo` deja contestar el correo directo al cliente.
        replyto: datos.contacto.includes("@") ? datos.contacto : undefined,
        mensaje: resumen(datos),
        // Campo trampa de Web3Forms contra bots. Va vacío a propósito.
        botcheck: "",
      }),
    });

    const json = (await res.json().catch(() => null)) as {
      success?: boolean;
    } | null;

    if (!res.ok || !json?.success) {
      return {
        estado: "error",
        mensaje: "No se pudo enviar. Escríbeme por WhatsApp y lo vemos ahí.",
      };
    }
    return { estado: "ok" };
  } catch {
    return {
      estado: "error",
      mensaje: "No se pudo enviar. Escríbeme por WhatsApp y lo vemos ahí.",
    };
  }
}
