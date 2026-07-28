import type { NextConfig } from "next";

/**
 * `DEPLOY_TARGET=pages` produce un export estático para GitHub Pages.
 *
 * Sin esa variable el build es el normal de Next (Vercel, §3.1), que sí soporta
 * Server Actions y el optimizador de imágenes. La configuración de Pages es una
 * desviación del despliegue objetivo, no el destino final.
 */
const esPages = process.env.DEPLOY_TARGET === "pages";

/** En un repo de proyecto el sitio cuelga de /<repo>, no de la raíz. */
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(esPages
    ? {
        output: "export",
        basePath,
        // Sin barra final, Pages devuelve 404 en las rutas anidadas.
        trailingSlash: true,
        // Pages no tiene el optimizador de imágenes de Next.
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
