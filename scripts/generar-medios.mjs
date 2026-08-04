/**
 * Genera las imágenes y el video del sitio con Kie.AI.
 *
 *   KIE_API_KEY=xxxxx node scripts/generar-medios.mjs
 *   KIE_API_KEY=xxxxx node scripts/generar-medios.mjs --fase 1
 *
 * La key se lee del entorno; NUNCA se escribe en este archivo.
 *
 * ORDEN POR COSTO — de menos a más caro, para que si se acaban los créditos
 * lo único que falte sea lo prescindible:
 *
 *   Fase 1 · Catálogo, 6 imágenes a 1K   → lo más barato (se ven a ~290px)
 *   Fase 2 · Sitio, 6 imágenes a 2K      → intermedio
 *   Fase 3 · Timelapse, 1 video          → con diferencia lo más caro
 *
 * Además SALTA lo que ya exista en disco: reintentar tras un fallo no vuelve
 * a gastar créditos por lo ya generado.
 *
 * NOTA DE HONESTIDAD (§13, criterio 12): estas imágenes son generadas, no
 * documentales. El sitio las marca en pantalla como tales. Deben sustituirse
 * por fotos reales antes de cualquier lanzamiento de verdad: el taller, el
 * fundador y el timelapse son los señalizadores de confianza del §7.5 y §14.
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const API_KEY = process.env.KIE_API_KEY;
if (!API_KEY) {
  console.error("Falta KIE_API_KEY en el entorno.");
  process.exit(1);
}

const BASE = "https://api.kie.ai";
const MODELO_IMG = process.env.KIE_IMAGE_MODEL || "nano-banana-pro";
const MODELO_VIDEO = process.env.KIE_VIDEO_MODEL || "veo3_fast";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_IMG = join(RAIZ, "public", "medios");
const OUT_VID = join(RAIZ, "public", "medios");

/* Estilo común. Documental y sin estilizar a propósito: el taller es de una
   sola persona y el §13 prohíbe la estética pulida de catálogo. La paleta es
   la del §4.1. */
const ESTILO =
  "Clean modern professional photography, bright soft even studio lighting, " +
  "a tidy contemporary digital fabrication studio, minimal and precise, " +
  "matte surfaces, palette of bone white, graphite grey and light concrete, " +
  "at most one small rust-orange accent, sharp focus, no clutter, " +
  "no rustic wood, no rusty tools, no workshop grime, " +
  "no text, no watermark, no logos, no brand names.";

/* Referencia de máquina: el taller trabaja con una CoreXY cerrada moderna
   (tipo Bambu Lab P2S). Se describe la MÁQUINA, nunca la marca: un logotipo
   de un tercero en un sitio comercial es un problema propio, y ya pasó una vez
   con otra marca que salió legible en el chasis. */
const IMPRESORA =
  "a modern enclosed CoreXY desktop 3D printer: a compact cube with a dark " +
  "tinted glass front door, a clean light-grey aluminium body, a flexible " +
  "textured steel build plate inside, and a four-spool automatic filament " +
  "feeder box sitting on top. Completely unbranded: blank panels, no logos, " +
  "no lettering, no badges, no screens showing text.";

const NEGATIVO =
  "rustic, wooden workbench, carpentry, sawdust, rust, dirty, cluttered, " +
  "vintage, hand tools, glossy, CGI, 3d render, neon, purple, electric blue, " +
  "lens flare, glow, text, watermark, logo, brand name, robot, gears, cog, " +
  "futuristic, sci-fi";

/* ── Fase 1 · Catálogo (1K, lo más barato) ────────────────────────────── */
const CATALOGO = [
  ["organizador-escritorio", "A 3D printed desk organizer with three compartments in matte bone-white filament, fine visible print layer lines, standing alone on a seamless light concrete-grey studio surface, soft even lighting, product photography."],
  ["soporte-audifonos", "A 3D printed headphone stand with a base, a column and a cradle in matte graphite-grey filament, fine visible print layer lines, alone on a seamless light grey studio surface, soft even lighting, product photography."],
  ["perilla-repuesto", "A small 3D printed replacement appliance knob in matte graphite-grey filament with fine visible layer lines, standing alone on a seamless light concrete-grey studio surface, macro product photography."],
  ["maceta-interior", "A 3D printed planter with straight tapered walls in matte bone-white filament, fine horizontal layer lines, a small green succulent inside, on a seamless light concrete-grey studio surface, soft even lighting."],
  ["tope-puerta", "A 3D printed flexible door wedge in matte graphite-grey filament with visible layer lines, alone on a seamless light concrete-grey studio surface, product photography."],
  ["gancho-pared", "A 3D printed wall hook in matte bone-white filament with fine visible print layer lines, mounted on a smooth plain light grey wall, nothing hanging from it, soft even lighting."],
].map(([slug, prompt]) => ({
  fase: 1,
  archivo: `catalogo/${slug}.jpg`,
  prompt,
  aspecto: "1:1",
  resolucion: "1K",
  w: 900,
  h: 900,
}));

/* ── Fase 2 · Imágenes del sitio (2K) ─────────────────────────────────── */
const SITIO = [
  {
    fase: 2,
    archivo: "hero-pieza.jpg",
    aspecto: "1:1",
    resolucion: "2K",
    w: 1200,
    h: 1200,
    /* Un intento anterior devolvió una pieza con forma de engrane y §13 los
       prohíbe expresamente: la forma va descrita en positivo, el negative
       prompt por sí solo no bastó. */
    prompt:
      `A freshly 3D printed matte bone-white L-shaped mounting bracket with two counterbored screw holes, sitting on the textured steel build plate inside ${IMPRESORA} Close macro through the open front, crisp visible print layer lines and a thin brim around the base. The part is a simple flat angular bracket: absolutely not a gear, not a cog, not round, no teeth, no spokes.`,
  },
  {
    fase: 2,
    archivo: "pieza-en-uso.jpg",
    aspecto: "3:2",
    resolucion: "2K",
    w: 1500,
    h: 1000,
    prompt:
      "Close up of clean hands holding a small matte graphite-grey 3D printed bracket, showing its real size against the fingers, seamless light grey studio background softly out of focus, bright even lighting.",
  },
  {
    fase: 2,
    archivo: "taller.jpg",
    aspecto: "4:5",
    resolucion: "2K",
    w: 1200,
    h: 1500,
    prompt:
      `A modern minimal 3D printing studio: three identical units of ${IMPRESORA} lined up on a clean white laminate bench against a smooth light concrete wall, neat rows of filament spools on a simple white shelf, digital calipers laid straight on the bench, a few finished matte parts arranged in a shallow tray. Bright, tidy, professional, nothing rustic.`,
  },
  {
    fase: 2,
    archivo: "fundador.jpg",
    aspecto: "1:1",
    resolucion: "2K",
    w: 1100,
    h: 1100,
    prompt:
      `A young man in a plain dark t-shirt standing at a clean white bench in a modern minimal 3D printing studio, looking down while measuring a matte printed part with digital calipers. ${IMPRESORA} is visible behind him, slightly out of focus. Bright even light, candid and unposed, not looking at the camera, tidy professional workspace.`,
  },
  {
    fase: 2,
    archivo: "empaque.jpg",
    aspecto: "3:4",
    resolucion: "2K",
    w: 900,
    h: 1200,
    prompt:
      "A matte 3D printed part nested in clean white tissue paper inside a plain white cardboard box ready to ship, a completely blank white shipping label on the lid, seamless light grey studio surface, bright even lighting, no text anywhere.",
  },
  {
    fase: 2,
    archivo: "macro-capas.jpg",
    aspecto: "16:9",
    resolucion: "2K",
    w: 1400,
    h: 800,
    prompt:
      "Extreme macro of the side wall of a 3D printed object filling the frame with fine parallel horizontal print layer lines in matte bone-white plastic, raking side light revealing the texture of every layer.",
  },
];

/* ── Fase 4 · Fondos de sección ───────────────────────────────────────────
   Van MUY desaturados y a baja opacidad detrás del contenido: dan profundidad
   sin pelearse con el texto. Por eso se piden planos, sin sujeto protagonista
   y sin zonas de alto contraste que arruinen la legibilidad. */
const FONDOS = [
  {
    fase: 4,
    archivo: "fondos/inicio.jpg",
    aspecto: "16:9",
    resolucion: "2K",
    w: 1800,
    h: 1012,
    prompt:
      `Wide soft-focus background of a modern minimal 3D printing studio with ${IMPRESORA} far away and out of focus. Very low contrast, flat even light, pale grey and bone white, mostly empty negative space, nothing sharp, no strong highlights or dark patches. Abstract calm backdrop.`,
  },
  {
    fase: 4,
    archivo: "fondos/catalogo.jpg",
    aspecto: "16:9",
    resolucion: "2K",
    w: 1800,
    h: 1012,
    prompt:
      "Wide flat-lay background: many matte 3D printed parts in bone white and grey arranged in a loose even grid on a seamless pale concrete surface, shot from directly above, very low contrast, soft flat light, no shadows, calm and uniform.",
  },
  {
    fase: 4,
    archivo: "fondos/cotiza.jpg",
    aspecto: "16:9",
    resolucion: "2K",
    w: 1800,
    h: 1012,
    prompt:
      "Wide background of a clean pale desk surface seen from above with a blank sheet of grid paper, a pencil and digital calipers laid flat and spaced apart, very low contrast, soft flat light, lots of empty space, no text or numbers anywhere.",
  },
  {
    fase: 4,
    archivo: "fondos/como-funciona.jpg",
    aspecto: "16:9",
    resolucion: "2K",
    w: 1800,
    h: 1012,
    prompt:
      "Wide abstract background: neat rows of filament spools in muted bone white and grey tones on simple shelving, strongly out of focus, very low contrast, flat even light, calm and uniform, no sharp detail.",
  },
  {
    fase: 4,
    archivo: "fondos/quien-hace-esto.jpg",
    aspecto: "16:9",
    resolucion: "2K",
    w: 1800,
    h: 1012,
    prompt:
      "Wide background of a smooth pale concrete studio wall with a clean empty white bench along the bottom edge, soft flat daylight, extremely minimal, very low contrast, almost empty frame.",
  },
];

/* ── Fase 3 · Video (lo más caro, va al final) ────────────────────────── */
const VIDEOS = [
  {
    fase: 3,
    archivo: "timelapse.mp4",
    aspecto: "9:16",
    /* La máquina es la misma que en las fotos: CoreXY cerrada con puerta de
       cristal oscuro y alimentador de cuatro bobinas. Se rueda con la puerta
       abierta, porque a través del cristal tintado no se vería la pieza. */
    prompt:
      `Vertical timelapse shot straight into the open front of ${IMPRESORA} The camera is locked off and never moves. Inside, on the textured steel build plate, a small matte bone-white L-shaped bracket grows upward layer by layer while the toolhead sweeps left and right above it. Clean bright studio workshop, no people, no music, no text, no on-screen numbers. The part is a simple flat angular bracket: not a gear, not round, no teeth.`,
  },
];

/* ────────────────────────────────────────────────────────────────────── */

const POLL = 6000;
const MAX_ESPERA_IMG = 300_000;
const MAX_ESPERA_VID = 600_000;

async function existe(ruta) {
  try {
    await access(ruta);
    return true;
  } catch {
    return false;
  }
}

async function crearTarea(modelo, input) {
  const res = await fetch(`${BASE}/api/v1/jobs/createTask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ model: modelo, input }),
  });
  const data = await res.json();
  if (data.code !== 200) {
    throw new Error(`createTask ${data.code}: ${data.message || data.msg}`);
  }
  return data.data.taskId;
}

async function esperarTarea(taskId, maxEspera) {
  const inicio = Date.now();
  while (Date.now() - inicio < maxEspera) {
    await new Promise((r) => setTimeout(r, POLL));
    const res = await fetch(
      `${BASE}/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`,
      { headers: { Authorization: `Bearer ${API_KEY}` } },
    );
    const data = await res.json();
    if (data.code !== 200) {
      throw new Error(`recordInfo ${data.code}: ${data.message || data.msg}`);
    }
    if (data.data.state === "success") {
      const urls = JSON.parse(data.data.resultJson).resultUrls;
      if (!urls?.[0]) throw new Error("success sin resultUrls");
      return urls[0];
    }
    if (data.data.state === "fail") {
      throw new Error(data.data.failMsg || "la tarea falló");
    }
  }
  throw new Error("timeout esperando a Kie");
}

async function generarImagen(spec) {
  const destino = join(OUT_IMG, spec.archivo);
  if (await existe(destino)) {
    console.log(`  ↷ ${spec.archivo} (ya existe, no gasta créditos)`);
    return;
  }
  const taskId = await crearTarea(MODELO_IMG, {
    prompt: `${spec.prompt} ${ESTILO}`,
    negative_prompt: NEGATIVO,
    aspect_ratio: spec.aspecto,
    resolution: spec.resolucion,
    output_format: "png",
  });
  const url = await esperarTarea(taskId, MAX_ESPERA_IMG);
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  await mkdir(dirname(destino), { recursive: true });
  await sharp(buf)
    .resize(spec.w, spec.h, { fit: "cover", position: "attention" })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(destino);
  console.log(`  ✓ ${spec.archivo}`);
}

/**
 * El video NO va por el endpoint unificado de jobs.
 *
 * Comprobado sondeando la API: en esta cuenta el único modelo de video que
 * `/api/v1/jobs/createTask` reconoce es la familia Sora, y ahora mismo
 * responde "This interface is temporarily paused". Veo sí está disponible,
 * pero con endpoint y polling propios.
 */
async function generarVideo(spec) {
  const destino = join(OUT_VID, spec.archivo);
  if (await existe(destino)) {
    console.log(`  ↷ ${spec.archivo} (ya existe, no gasta créditos)`);
    return;
  }

  const res = await fetch(`${BASE}/api/v1/veo/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      prompt: `${spec.prompt} ${ESTILO}`,
      model: MODELO_VIDEO,
      aspectRatio: spec.aspecto,
      enableTranslation: false,
    }),
  });
  const creado = await res.json();
  if (creado.code !== 200) {
    throw new Error(`veo/generate ${creado.code}: ${creado.msg}`);
  }
  const taskId = creado.data.taskId;

  const inicio = Date.now();
  let url = null;
  while (Date.now() - inicio < MAX_ESPERA_VID) {
    await new Promise((r) => setTimeout(r, POLL));
    const r = await fetch(
      `${BASE}/api/v1/veo/record-info?taskId=${encodeURIComponent(taskId)}`,
      { headers: { Authorization: `Bearer ${API_KEY}` } },
    );
    const d = await r.json();
    if (d.code !== 200) throw new Error(`record-info ${d.code}: ${d.msg}`);
    const flag = d.data?.successFlag;
    if (flag === 1) {
      url = d.data?.response?.resultUrls?.[0];
      if (!url) throw new Error("éxito sin resultUrls");
      break;
    }
    if (flag === 2 || flag === 3) {
      throw new Error(d.data?.errorMessage || "la generación falló");
    }
  }
  if (!url) throw new Error("timeout esperando el video");

  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  await mkdir(dirname(destino), { recursive: true });
  await writeFile(destino, buf);
  console.log(`  ✓ ${spec.archivo}`);
}

async function correrFase(n, specs, fn) {
  console.log(`\n━━━ Fase ${n} · ${specs.length} elemento(s) ━━━`);
  let ok = 0;
  for (const spec of specs) {
    try {
      await fn(spec);
      ok++;
    } catch (e) {
      console.error(`  ✗ ${spec.archivo} — ${e.message}`);
      // Si Kie dice que no hay saldo, parar: seguir solo acumula errores.
      if (/credit|balance|insufficient|saldo|quota/i.test(e.message)) {
        console.error(
          "\n  Parece que se acabaron los créditos de Kie. Paro aquí.",
        );
        console.error("  Lo ya generado queda en disco; al reintentar se salta.");
        return { ok, cortado: true };
      }
    }
  }
  return { ok, cortado: false };
}

async function main() {
  const soloFase = process.argv.includes("--fase")
    ? Number(process.argv[process.argv.indexOf("--fase") + 1])
    : null;

  const fases = [
    [1, CATALOGO, generarImagen, "catálogo, 1K — lo más barato"],
    [2, SITIO, generarImagen, "sitio, 2K"],
    [3, VIDEOS, generarVideo, "timelapse — lo más caro"],
    [4, FONDOS, generarImagen, "fondos de sección, 2K"],
  ];

  console.log(`Modelo de imagen: ${MODELO_IMG}`);
  console.log(`Modelo de video:  ${MODELO_VIDEO}`);

  for (const [n, specs, fn, etiqueta] of fases) {
    if (soloFase && soloFase !== n) continue;
    console.log(`\n▸ Fase ${n}: ${etiqueta}`);
    const { cortado } = await correrFase(n, specs, fn);
    if (cortado) process.exit(1);
  }

  console.log("\nListo. Archivos en public/medios/");
}

main();
