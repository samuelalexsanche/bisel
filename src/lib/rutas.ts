/**
 * Prefijo del despliegue.
 *
 * En GitHub Pages el sitio cuelga de /<repo>, no de la raíz. Next añade el
 * `basePath` a `<Link>` y a las rutas, pero NO a los `src` de `next/image`
 * cuando las imágenes van `unoptimized`, ni a atributos escritos a mano como
 * el `poster` de un `<video>`. Sin esto, las imágenes apuntan fuera del sitio
 * y devuelven 404 en producción — que es justo lo que pasó.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** URL de un archivo de /public/medios, con el prefijo del despliegue. */
export function medio(ruta: string): string {
  return `${BASE}/medios/${ruta.replace(/^\/+/, "")}`;
}
