"""Punto de entrada: lee las facturas, analiza y exporta el JSON de resultados."""
from __future__ import annotations

import sys
import io
from pathlib import Path

from src import LectorFacturas, AnalizadorFacturas, ExportadorJSON

# Forzar UTF-8 en consola Windows (cp1252 por defecto).
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

# Rutas ancladas a backend/ (no al directorio de trabajo).
BASE_DIR = Path(__file__).resolve().parent


def main() -> None:
    # 1. Extraccion
    lector = LectorFacturas(carpeta=str(BASE_DIR / "facturas"))
    lineas = lector.leer_todas()
    print(f"Lineas extraidas: {len(lineas)}")

    # 2. Analisis
    analizador = AnalizadorFacturas(lineas)
    reporte = analizador.reporte_completo()

    # 3. Exportacion a JSON
    exportador = ExportadorJSON(carpeta=str(BASE_DIR / "output"))
    ruta = exportador.exportar(reporte, nombre="analisis.json")

    # Resumen en consola
    kpis = reporte["kpis"]
    print("\n--- KPIs ---")
    for clave, valor in kpis.items():
        print(f"  {clave}: {valor}")
    print(f"\nJSON generado en: {ruta}")


if __name__ == "__main__":
    main()
