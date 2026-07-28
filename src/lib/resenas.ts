export type Resena = {
  /** Nombre real de quien la escribió. Sin nombre, no se publica. */
  nombre: string;
  texto: string;
  /** Ciudad de quien compró, si la dio. */
  ciudad?: string;
  /** ISO 8601. */
  fecha: string;
};

/**
 * Reseñas reales — §7.1 sección 7.
 *
 * PROHIBIDO ABSOLUTAMENTE: reseñas inventadas, "+500 clientes satisfechos",
 * cifras sin respaldo (§7.1, §13, criterio 12). Somos nuevos y lo vamos a decir.
 *
 * El array está vacío a propósito: todavía no hay ventas. La sección de reseñas
 * no se monta mientras siga vacío. Se llena desde la venta número uno, que es
 * además donde está la autoridad real para este negocio (§10).
 */
export const RESENAS: readonly Resena[] = [];
