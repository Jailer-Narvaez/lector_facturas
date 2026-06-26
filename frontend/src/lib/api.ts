import type { ProcesarResponse, Reporte } from '../types/report';

/**
 * Envía los PDF al backend FastAPI, que regenera output/analisis.json y
 * devuelve el reporte ya calculado.
 */
export async function procesarFacturas(archivos: File[]): Promise<ProcesarResponse> {
  const fd = new FormData();
  archivos.forEach((f) => fd.append('files', f));

  const res = await fetch('/api/procesar', { method: 'POST', body: fd });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { detail?: string };
    throw new Error(err.detail || `Error del servidor (${res.status})`);
  }
  return res.json() as Promise<ProcesarResponse>;
}

/**
 * Carga el último análisis guardado (output/analisis.json). Útil para
 * mostrar el dashboard con datos previos sin volver a procesar.
 */
export async function cargarUltimoReporte(): Promise<Reporte> {
  const res = await fetch('/output/analisis.json');
  if (!res.ok) throw new Error(`No se pudo cargar el análisis (${res.status})`);
  return res.json() as Promise<Reporte>;
}
