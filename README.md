# Lector de Facturas · Davrant Analytics

Lee facturas en PDF (carpeta `facturas/`), extrae las líneas de detalle
(**Servicio, Cantidad, Precio, Total**) con Python + pandas, genera un JSON de
análisis en `output/` y lo visualiza en un dashboard web con paleta oscura
premium.

---

## Requisitos

- **Python 3.12+** (probado en 3.14)
- Un navegador moderno

---

## Estructura

```
lector_facturas/
├── main.py                 # Punto de entrada: extrae → analiza → exporta
├── src/
│   ├── extractor.py        # LectorFacturas + LineaServicio (lee los PDF)
│   ├── analizador.py       # AnalizadorFacturas (DataFrames con pandas)
│   └── exportador.py       # ExportadorJSON (escribe output/analisis.json)
├── facturas/               # PDFs de entrada
├── output/
│   └── analisis.json       # Resultado del análisis (consumido por el front)
└── web/
    ├── index.html          # Dashboard
    ├── styles.css          # Estilos (paleta oscura premium)
    └── app.js              # Carga el JSON y dibuja KPIs, tabla y gráficos
```

---

## 1. Instalación

Crea el entorno virtual e instala las dependencias:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install pdfplumber pandas
```

> En macOS/Linux usa `.venv/bin/python` en lugar de `.\.venv\Scripts\python.exe`.

---

## 2. Generar el análisis (Python)

Coloca las facturas PDF en `facturas/` y ejecuta:

```powershell
.\.venv\Scripts\python.exe main.py
```

Esto crea/actualiza **`output/analisis.json`** y muestra los KPIs por consola.

El JSON contiene cuatro secciones:

| Clave | Descripción |
|-------|-------------|
| `kpis` | Indicadores generales (ventas totales, ticket promedio, etc.) |
| `ventas_por_servicio` | Ventas, unidades, precio promedio y % por servicio |
| `resumen_por_factura` | Totales agregados por factura / cliente |
| `detalle` | Una fila por línea de servicio (tabla base) |

Los importes se exportan como **números** (no texto), listos para JavaScript.

---

## 3. Ver el dashboard (Web)

El navegador bloquea `fetch()` sobre `file://`, así que sirve el proyecto con un
servidor local **desde la raíz**:

```powershell
.\.venv\Scripts\python.exe -m http.server 8000
```

Abre **http://localhost:8000/web/** en el navegador.

El front lee `../output/analisis.json` y muestra:

- **KPIs** (ventas totales, facturas, unidades, ticket promedio, servicio top)
- **Gráfico de barras**: ventas por servicio
- **Doughnut**: participación porcentual por servicio
- **Tabla**: resumen por cliente

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

- Para reproducir el entorno, puedes congelar dependencias con
  `.\.venv\Scripts\python.exe -m pip freeze > requirements.txt`.
- El front usa [Chart.js](https://www.chartjs.org/) vía CDN (requiere conexión a
  internet la primera vez).
