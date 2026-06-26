"""Extraccion de lineas de detalle desde las facturas PDF."""
from __future__ import annotations

import re
import glob
from dataclasses import dataclass

import pdfplumber


@dataclass
class LineaServicio:
    """Una linea de detalle de una factura."""
    factura: str
    cliente: str
    servicio: str
    cantidad: int
    precio: int
    total: int


class LectorFacturas:
    """Lee todas las facturas PDF de una carpeta y devuelve sus lineas de detalle.

    Cada linea de servicio tiene el formato:  <Servicio> <Cantidad> $<Precio> $<Total>
    Los importes usan formato colombiano (punto como separador de miles).
    """

    # <servicio> <cantidad> $<precio> $<total>
    _LINEA = re.compile(
        r"^(?P<servicio>.+?)\s+(?P<cantidad>\d+)\s+\$(?P<precio>[\d.]+)\s+\$(?P<total>[\d.]+)$"
    )
    _NOMBRE = re.compile(r"NOMBRE:\s*(.+?)\s+CORREO:")

    def __init__(self, carpeta: str = "facturas") -> None:
        self.carpeta = carpeta

    @staticmethod
    def _a_numero(texto: str) -> int:
        """'$200.000' -> 200000."""
        return int(texto.replace("$", "").replace(".", "").strip())

    def _leer_pdf(self, ruta: str) -> list[LineaServicio]:
        with pdfplumber.open(ruta) as pdf:
            texto = "\n".join(p.extract_text() or "" for p in pdf.pages)

        m = self._NOMBRE.search(texto)
        cliente = m.group(1).strip() if m else "Desconocido"
        nombre_archivo = ruta.replace("\\", "/").split("/")[-1]

        lineas: list[LineaServicio] = []
        for linea in texto.splitlines():
            linea = linea.strip()
            if linea.lower().startswith("servicio cantidad"):
                continue  # encabezado de la tabla
            m = self._LINEA.match(linea)
            if not m:
                continue
            lineas.append(
                LineaServicio(
                    factura=nombre_archivo,
                    cliente=cliente,
                    servicio=m.group("servicio").strip(),
                    cantidad=int(m.group("cantidad")),
                    precio=self._a_numero(m.group("precio")),
                    total=self._a_numero(m.group("total")),
                )
            )
        return lineas

    def leer_todas(self) -> list[LineaServicio]:
        """Devuelve las lineas de detalle de todas las facturas de la carpeta."""
        lineas: list[LineaServicio] = []
        for ruta in sorted(glob.glob(f"{self.carpeta}/*.pdf")):
            lineas.extend(self._leer_pdf(ruta))
        return lineas
