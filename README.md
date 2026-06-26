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
├── backend/                # API FastAPI + pipeline de análisis (Python)
│   ├── api.py              # /api/procesar + sirve frontend/dist
│   ├── main.py             # CLI alterno: extrae → analiza → exporta (sin web)
│   ├── requirements.txt    # Dependencias Python
│   ├── src/
│   │   ├── extractor.py    # LectorFacturas + LineaServicio (lee los PDF)
│   │   ├── analizador.py   # AnalizadorFacturas (DataFrames con pandas)
│   │   └── exportador.py   # ExportadorJSON (escribe output/analisis.json)
│   ├── facturas/           # PDFs de muestra (entrada del modo CLI)
│   ├── output/
│   │   └── analisis.json   # Resultado del análisis (consumido por el front)
│   └── img/logo.png        # Logo (servido por la API)
└── frontend/               # SPA en React + Vite + TypeScript
    ├── index.html          # HTML raíz de Vite
    ├── vite.config.ts      # Proxy a FastAPI en dev (/api, /img, /output)
    ├── dist/               # Build de producción (lo sirve FastAPI)
    └── src/
        ├── main.tsx        # Punto de entrada de React
        ├── App.tsx         # Orquesta auth + navegación + estado del reporte
        ├── types/          # Tipos del reporte (report.ts)
        ├── lib/            # api, formato, paleta, registro de Chart.js
        ├── hooks/          # useAuth (login demo)
        ├── styles/         # theme.css (tokens + reset, paleta Davrant)
        └── components/     # ui · auth · layout · upload · dashboard
```

> El `.venv` de Python vive en la raíz del proyecto; el backend se ejecuta
> desde `backend/` usando ese intérprete (`..\.venv\Scripts\python.exe`).

---

## 1. Instalación

### Backend (Python)

Desde la **raíz del proyecto**:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
```

> En macOS/Linux usa `.venv/bin/python` en lugar de `.\.venv\Scripts\python.exe`.

### Frontend (Node 18+)

```powershell
cd frontend
npm install
```

---

## 2. Ejecutar la app

### Opción A — Producción (un solo servidor)

Compila el front y deja que FastAPI lo sirva en el mismo origen:

```powershell
cd frontend; npm run build; cd ..\backend
..\.venv\Scripts\python.exe -m uvicorn api:app --port 8000 --reload
```

Abre **http://localhost:8000/** en el navegador.

### Opción B — Desarrollo del front (hot reload)

Dos terminales. El dev server de Vite proxya `/api`, `/img` y `/output` al backend:

```powershell
# Terminal 1 — backend (desde backend/)
cd backend; ..\.venv\Scripts\python.exe -m uvicorn api:app --port 8000 --reload

# Terminal 2 — frontend (desde frontend/)
cd frontend; npm run dev
```

Abre **http://localhost:5173/** (la URL que imprime Vite).

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

Para generar el JSON sin levantar el servidor (lee `backend/facturas/`):

```powershell
cd backend
..\.venv\Scripts\python.exe main.py
```

Crea/actualiza `backend/output/analisis.json` y muestra los KPIs por consola.

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

- El login es **solo demo** (credenciales en el cliente, en `useAuth`); no usar
  en producción.
- El front (React + TypeScript) usa [Chart.js](https://www.chartjs.org/) vía
  `react-chartjs-2`, empaquetado por Vite (sin CDN).
- `uvicorn ... --reload` recarga el backend al guardar cambios en Python;
  `npm run dev` recarga el front en caliente.
- Hay que **recompilar el front** (`npm run build`) para que la Opción A refleje
  cambios del frontend.
