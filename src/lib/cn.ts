/**
 * Une clases condicionales. Deliberadamente sin `clsx` ni `tailwind-merge`:
 * el presupuesto de JS inicial es de 90 KB gzip (§6) y esto son 4 líneas.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
