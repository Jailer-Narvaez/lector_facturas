"""Exportacion de los analisis a JSON (consumible desde JavaScript)."""
from __future__ import annotations

import os
import json


def _json_safe(o):
    """Convierte tipos de numpy/pandas a tipos nativos de Python."""
    if hasattr(o, "item"):  # numpy scalars (int64, float64, bool_)
        return o.item()
    return str(o)


class ExportadorJSON:
    """Escribe un reporte (dict) como JSON en la carpeta de salida."""

    def __init__(self, carpeta: str = "output") -> None:
        self.carpeta = carpeta
        os.makedirs(self.carpeta, exist_ok=True)

    def exportar(self, datos: dict, nombre: str = "analisis.json") -> str:
        ruta = os.path.join(self.carpeta, nombre)
        with open(ruta, "w", encoding="utf-8") as f:
            json.dump(datos, f, ensure_ascii=False, indent=2, default=_json_safe)
        return ruta
