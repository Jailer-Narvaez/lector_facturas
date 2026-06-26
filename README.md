# Lector de Facturas · Davrant Analytics

Demo full-stack: sube facturas en PDF desde el navegador, un backend **FastAPI**
las procesa con Python + pandas (extrae **Servicio, Cantidad, Precio, Total**),
regenera un JSON de análisis y un **dashboard** lo visualiza. Paleta oscura
basada en [davrant.com](https://davrant.com).

---

## Requisitos

- **Python 3.12+** (probado en 3.14)
- Un navegador moderno

---

## Estructura

```
lector_facturas/
├── api.py                  # Backend FastAPI: /api/procesar + sirve el front
├── main.py                 # CLI alterno: extrae → analiza → exporta (sin web)
├── src/
│   ├── extractor.py        # LectorFacturas + LineaServicio (lee los PDF)
│   ├── analizador.py       # AnalizadorFacturas (DataFrames con pandas)
│   └── exportador.py       # ExportadorJSON (escribe output/analisis.json)
├── facturas/               # PDFs de muestra (entrada del modo CLI)
├── output/
│   └── analisis.json       # Resultado del análisis (consumido por el front)
├── img/logo.png            # Logo
└── web/
    ├── index.html          # SPA: login + módulos (cargar facturas / dashboard)
    ├── styles.css          # Estilos (paleta Davrant)
    └── app.js              # Auth demo, carga de archivos y gráficos (Chart.js)
```

---

## 1. Instalación

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

> En macOS/Linux usa `.venv/bin/python` en lugar de `.\.venv\Scripts\python.exe`.

---

## 2. Ejecutar la app (backend + front)

Levanta el servidor FastAPI **desde la raíz del proyecto**:

```powershell
.\.venv\Scripts\python.exe -m uvicorn api:app --port 8000 --reload
```

Abre **http://localhost:8000/** en el navegador.

### Flujo

1. **Login (demo):** `admin@davrant.com` / `demo123`.
2. **Cargar facturas:** arrastra o selecciona PDFs y pulsa **Procesar facturas**.
   - El front hace `POST /api/procesar` con los archivos.
   - El backend procesa **solo los PDF subidos** (en una carpeta temporal
     aislada), regenera `output/analisis.json` y devuelve el reporte.
3. **Dashboard:** muestra KPIs, ventas por servicio (barras), participación
   (doughnut) y resumen por cliente (tabla).

> Cada carga es independiente: no se acumula ni se mezcla con `facturas/`. La
> carpeta `facturas/` queda solo como datos de muestra para el modo CLI
> (`main.py`).

---

## 3. Alternativa: solo CLI (sin web)

Para generar el JSON sin levantar el servidor:

```powershell
.\.venv\Scripts\python.exe main.py
```

Crea/actualiza `output/analisis.json` y muestra los KPIs por consola.

---

## JSON de salida (`output/analisis.json`)

| Clave | Descripción |
|-------|-------------|
| `kpis` | Indicadores generales (ventas totales, ticket promedio, etc.) |
| `ventas_por_servicio` | Ventas, unidades, precio promedio y % por servicio |
| `resumen_por_factura` | Totales agregados por factura / cliente |
| `detalle` | Una fila por línea de servicio (tabla base) |

Los importes se exportan como **números** (no texto), listos para JavaScript.

---

## Formato esperado de las facturas

Cada PDF debe contener una tabla con las columnas **Servicio · Cantidad ·
Precio · Total**, e idealmente la línea `NOMBRE: <cliente>`. Los importes usan
formato colombiano (`$1.000.000`). El extractor parsea cada línea con el patrón:

```
<Servicio> <Cantidad> $<Precio> $<Total>
```

---

## Notas

- El login es **solo demo** (credenciales en el cliente); no usar en producción.
- El front usa [Chart.js](https://www.chartjs.org/) vía CDN (requiere internet la
  primera vez).
- `uvicorn ... --reload` recarga el backend al guardar cambios en Python.
