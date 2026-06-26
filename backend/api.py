r"""Backend FastAPI: recibe facturas PDF, regenera el JSON de analisis y sirve el front React.

Ejecutar (desde la carpeta backend/, sirviendo el build de produccion):
    cd ../frontend && npm run build && cd ../backend
    ..\.venv\Scripts\python.exe -m uvicorn api:app --port 8000 --reload

Luego abrir:  http://localhost:8000/

En desarrollo del front, usar el dev server de Vite (npm run dev en frontend/),
que proxya /api, /img y /output a este backend en el puerto 8000.
"""
from __future__ import annotations

import os
import shutil
import tempfile
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles

from src import LectorFacturas, AnalizadorFacturas, ExportadorJSON

# Rutas ancladas a la ubicacion de este fichero (no al directorio de trabajo),
# para que el backend funcione sin importar desde donde se lance uvicorn.
BASE_DIR = Path(__file__).resolve().parent          # .../backend
ROOT_DIR = BASE_DIR.parent                          # raiz del proyecto
OUTPUT = BASE_DIR / "output"
IMG = BASE_DIR / "img"
FRONTEND_DIST = ROOT_DIR / "frontend" / "dist"

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
        ExportadorJSON(str(OUTPUT)).exportar(reporte, "analisis.json")

        return {"procesados": guardados, "reporte": reporte}
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


# --- Archivos estaticos (mismo origen que la API, sin CORS) ---
# Recursos del backend primero; el front (SPA) se monta en "/" al final como
# catch-all, sirviendo frontend/dist/index.html en la raiz.
OUTPUT.mkdir(exist_ok=True)
app.mount("/output", StaticFiles(directory=str(OUTPUT)), name="output")
app.mount("/img", StaticFiles(directory=str(IMG)), name="img")

if FRONTEND_DIST.is_dir():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIST), html=True), name="frontend")
else:  # pragma: no cover - aviso util si falta el build
    @app.get("/")
    def home():
        return {
            "detail": "Front no compilado. Ejecuta:  cd frontend && npm run build",
        }
