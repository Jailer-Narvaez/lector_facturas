// Formateadores compartidos (locale Colombia).

export const COP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export const NUM = new Intl.NumberFormat('es-CO');

/** Tamaño de archivo legible (KB / MB). */
export function formatBytes(n: number): string {
  return n < 1024 * 1024
    ? `${(n / 1024).toFixed(0)} KB`
    : `${(n / 1024 / 1024).toFixed(1)} MB`;
}
