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
  "Documentary photography, honest and unstyled, natural window light, " +
  "real small one-person workshop in Mexico, muted palette of bone white, " +
  "graphite grey and concrete grey, one single rust-orange accent at most, " +
  "matte surfaces, no gloss, no lens flare, no bokeh balls, no text, " +
  "no watermark, no logos, no brand names, realistic and slightly imperfect.";

const NEGATIVO =
  "glossy, shiny, plastic-looking render, CGI, 3d render, neon, purple, " +
  "electric blue, lens flare, glow, text, watermark, logo, robot, gears, " +
  "futuristic, sci-fi";

/* ── Fase 1 · Catálogo (1K, lo más barato) ────────────────────────────── */
const CATALOGO = [
  ["organizador-escritorio", "A 3D printed desk organizer with three compartments, matte bone-white filament, visible fine print layer lines, standing on a plain concrete-grey surface, seen slightly from above."],
  ["soporte-audifonos", "A 3D printed headphone stand with a base, a column and a cradle, matte graphite-grey filament, visible print layer lines, on a plain light surface."],
  ["perilla-repuesto", "A small 3D printed replacement knob for an appliance, matte dark grey filament, visible layer lines, held between two fingers over a workbench."],
  ["maceta-interior", "A small 3D printed planter with straight tapered walls, matte bone-white filament, visible horizontal layer lines, a small succulent inside, on a wooden table."],
  ["tope-puerta", "A 3D printed flexible door wedge, matte dark grey rubbery filament, visible layer lines, resting on a tiled floor next to a door."],
  ["gancho-pared", "A 3D printed wall hook screwed to a plain white wall, matte bone-white filament, visible print layer lines, a canvas bag hanging from it."],
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
    prompt:
      "A freshly 3D printed matte bone-white part still sitting on the textured print bed of a desktop 3D printer, close up, visible print layer lines and a faint brim around the base, warm side light from a window.",
  },
  {
    fase: 2,
    archivo: "pieza-en-uso.jpg",
    aspecto: "3:2",
    resolucion: "2K",
    w: 1500,
    h: 1000,
    prompt:
      "A person's hand holding a small matte 3D printed bracket up close, showing its real size against the fingers, plain workshop background slightly out of focus, honest documentary framing.",
  },
  {
    fase: 2,
    archivo: "taller.jpg",
    aspecto: "4:5",
    resolucion: "2K",
    w: 1200,
    h: 1500,
    /* Se insiste en impresoras genéricas y sin rótulos: el primer intento
       devolvió una máquina con la marca de un fabricante legible en el chasis,
       y no puede aparecer una marca de terceros en un sitio comercial. */
    prompt:
      "The corner of a small real one-person 3D printing workshop: two generic unbranded desktop 3D printers with completely blank frames and no lettering, logos or badges anywhere, on a plain wooden bench, spools of filament on a shelf, calipers and hand tools scattered, some finished parts in a tray, slightly untidy and clearly used, daylight from a side window.",
  },
  {
    fase: 2,
    archivo: "fundador.jpg",
    aspecto: "1:1",
    resolucion: "2K",
    w: 1100,
    h: 1100,
    prompt:
      "A young man in a plain t-shirt working at a workbench in a small 3D printing workshop, looking down at a printed part he is holding and measuring with calipers, natural window light, candid and unposed, not looking at the camera.",
  },
  {
    fase: 2,
    archivo: "empaque.jpg",
    aspecto: "3:4",
    resolucion: "2K",
    w: 900,
    h: 1200,
    prompt:
      "A small 3D printed part wrapped in plain kraft paper inside a simple cardboard box ready to ship, a blank shipping label on top, plain workbench, no text visible on the label.",
  },
  {
    fase: 2,
    archivo: "macro-capas.jpg",
    aspecto: "16:9",
    resolucion: "2K",
    w: 1400,
    h: 800,
    prompt:
      "Extreme macro of the side wall of a 3D printed object, filling the frame with fine parallel horizontal print layer lines in matte bone-white plastic, raking side light revealing the texture of each layer.",
  },
];

/* ── Fase 3 · Video (lo más caro, va al final) ────────────────────────── */
const VIDEOS = [
  {
    fase: 3,
    archivo: "timelapse.mp4",
    aspecto: "9:16",
    prompt:
      "Vertical timelapse of a desktop 3D printer building a small matte bone-white part layer by layer on its print bed. Fixed camera, the nozzle moves back and forth and the part slowly grows upward. Real workshop lighting, no music, no text, no people.",
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
