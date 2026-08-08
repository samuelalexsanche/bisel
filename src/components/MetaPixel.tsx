"use client";

import { useEffect } from "react";

import { PIXEL_ACTIVO, PIXEL_ID } from "@/lib/pixel";

/**
 * Script base del Meta Pixel — §14.7.
 *
 * Sin NEXT_PUBLIC_META_PIXEL_ID no renderiza nada: el sitio se queda sin
 * tracking y sin peticiones a Facebook, igual que antes. Con ID, carga
 * fbevents.js con el fragmento canónico de Meta, hace `init` y dispara
 * PageView (el sitio es SSG estático, así que cada carga real de página
 * corresponde a un PageView real).
 */
export function MetaPixel() {
  useEffect(() => {
    if (!PIXEL_ACTIVO) return;

    // El fragmento exacto que Meta entrega en Events Manager (v2.0), con el
    // ID interpolado. Se inyecta como script para que el orden sea el mismo
    // que el snippet de instalación oficial.
    const script = document.createElement("script");
    script.async = true;
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window,
      document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${PIXEL_ID}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);
  }, []);

  // Fallback del snippet oficial: un pixel <img> para quien navega sin JS
  // (criterio 10 del sitio: el contenido funciona sin JavaScript). Se renderiza
  // en el SSR estático, así que aparece en el HTML de cada página.
  if (!PIXEL_ACTIVO) return null;
  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element -- snippet oficial
          de Meta: <img> de 1px para quien navega sin JS. next/image no aplica. */}
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        alt=""
        src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
      />
    </noscript>
  );
}
