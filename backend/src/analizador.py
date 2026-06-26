"""Analisis de datos de las facturas con pandas."""
from __future__ import annotations

from dataclasses import asdict

import pandas as pd

from .extractor import LineaServicio


class AnalizadorFacturas:
    """Construye los DataFrames de analisis a partir de las lineas de detalle."""

    def __init__(self, lineas: list[LineaServicio]) -> None:
        self.df = pd.DataFrame([asdict(l) for l in lineas])

    def detalle(self) -> pd.DataFrame:
        """Tabla base: una fila por linea de servicio."""
        return self.df

    def por_servicio(self) -> pd.DataFrame:
        """Ventas, unidades y precio promedio agrupados por servicio."""
        res = (
            self.df.groupby("servicio")
            .agg(
                veces_vendido=("servicio", "size"),
                cantidad_total=("cantidad", "sum"),
                ventas_total=("total", "sum"),
                precio_promedio=("precio", "mean"),
            )
            .sort_values("ventas_total", ascending=False)
            .reset_index()
        )
        res["precio_promedio"] = res["precio_promedio"].round(0).astype(int)
        res["pct_ventas"] = (res["ventas_total"] / res["ventas_total"].sum() * 100).round(1)
        return res

    def por_factura(self) -> pd.DataFrame:
        """Resumen agregado por factura/cliente."""
        return (
            self.df.groupby(["factura", "cliente"])
            .agg(
                num_servicios=("servicio", "size"),
                unidades=("cantidad", "sum"),
                total_factura=("total", "sum"),
            )
            .sort_values("total_factura", ascending=False)
            .reset_index()
        )

    def kpis(self) -> dict:
        """Indicadores generales del conjunto de facturas."""
        por_factura = self.por_factura()
        por_servicio = self.por_servicio()
        return {
            "ventas_totales": int(self.df["total"].sum()),
            "num_facturas": int(self.df["factura"].nunique()),
            "num_lineas": int(len(self.df)),
            "unidades_vendidas": int(self.df["cantidad"].sum()),
            "ticket_promedio": round(float(por_factura["total_factura"].mean()), 2),
            "servicios_distintos": int(self.df["servicio"].nunique()),
            "servicio_top": str(por_servicio.iloc[0]["servicio"]),
        }

    def reporte_completo(self) -> dict:
        """Diccionario con todos los analisis, listo para serializar a JSON."""
        return {
            "kpis": self.kpis(),
            "ventas_por_servicio": self.por_servicio().to_dict(orient="records"),
            "resumen_por_factura": self.por_factura().to_dict(orient="records"),
            "detalle": self.detalle().to_dict(orient="records"),
        }
