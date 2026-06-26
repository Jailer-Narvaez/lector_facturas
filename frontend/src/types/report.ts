// Tipos del reporte que devuelve el backend FastAPI (src/analizador.py).
// Reflejan la forma de output/analisis.json — los importes son números.

export interface Kpis {
  ventas_totales: number;
  num_facturas: number;
  num_lineas: number;
  unidades_vendidas: number;
  ticket_promedio: number;
  servicios_distintos: number;
  servicio_top: string;
}

export interface VentaPorServicio {
  servicio: string;
  veces_vendido: number;
  cantidad_total: number;
  ventas_total: number;
  precio_promedio: number;
  pct_ventas: number;
}

export interface ResumenPorFactura {
  factura: string;
  cliente: string;
  num_servicios: number;
  unidades: number;
  total_factura: number;
}

export interface LineaDetalle {
  factura: string;
  cliente: string;
  servicio: string;
  cantidad: number;
  precio: number;
  total: number;
}

export interface Reporte {
  kpis: Kpis;
  ventas_por_servicio: VentaPorServicio[];
  resumen_por_factura: ResumenPorFactura[];
  detalle: LineaDetalle[];
}

/** Respuesta de POST /api/procesar */
export interface ProcesarResponse {
  procesados: string[];
  reporte: Reporte;
}
