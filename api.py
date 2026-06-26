"""Backend FastAPI: recibe facturas PDF, regenera el JSON de analisis y sirve el front.

Ejecutar:
    .\.venv\Scripts\python.exe -m uvicorn api:app --port 8000 --reload

Luego abrir:  http://localhost:8000/
"""
from __future__ import annotations

import os
import shutil
import tempfile

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse

from src import LectorFacturas, AnalizadorFacturas, ExportadorJSON

OUTPUT = "output"

app = FastAPI(title="Davrant · API de Facturas")


@app.post("/api/procesar")
async def procesar(files: list[UploadFile] = File(...)):
    """Analiza SOLO los PDF recibidos en esta carga, regenera el JSON y devuelve el reporte."""
    # Carpeta temporal aislada: cada carga analiza unicamente lo que se sube,
    # sin acumular ni mezclarse con facturas/.
    tmp = tempfile.mkdtemp(prefix="facturas_")
    try:
        guardados = []
        for f in files:
            if not f.filename.lower().endswith(".pdf"):
                continue
            destino = os.path.join(tmp, os.path.basename(f.filename))
            with open(destino, "wb") as out:
                shutil.copyfileobj(f.file, out)
            guardados.append(os.path.basename(f.filename))

        # Pipeline (reutiliza el paquete src/): extraer -> analizar -> exportar
        lineas = LectorFacturas(tmp).leer_todas()
        if not lineas:
            raise HTTPException(status_code=400, detail="No se extrajeron lineas de los PDF subidos.")

        reporte = AnalizadorFacturas(lineas).reporte_completo()
        ExportadorJSON(OUTPUT).exportar(reporte, "analisis.json")

        return {"procesados": guardados, "reporte": reporte}
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


# --- Archivos estaticos (mismo origen que la API, sin CORS) ---
app.mount("/web", StaticFiles(directory="web", html=True), name="web")
app.mount("/output", StaticFiles(directory=OUTPUT), name="output")
app.mount("/img", StaticFiles(directory="img"), name="img")


@app.get("/")
def home():
    return RedirectResponse("/web/")
