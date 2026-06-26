// Front del análisis de facturas. Consume output/analisis.json generado por Python.

// Paleta de acentos de Davrant (davrant.com)
const PALETTE = ["#229cc0", "#00e5ff", "#7c5cff", "#ffb020", "#ff3366"];
const COP = new Intl.NumberFormat("es-CO", {
  style: "currency", currency: "COP", maximumFractionDigits: 0,
});
const NUM = new Intl.NumberFormat("es-CO");

// Estilos globales de Chart.js acordes a la paleta oscura.
Chart.defaults.color = "#7a83a8";
Chart.defaults.font.family = "Inter, system-ui, sans-serif";
Chart.defaults.font.size = 11;

async function cargarDatos() {
  // El JSON vive en ../output/ respecto a /web/
  const res = await fetch("../output/analisis.json");
  if (!res.ok) throw new Error(`No se pudo cargar el JSON (${res.status})`);
  return res.json();
}

function renderKpis(k) {
  const items = [
    { label: "Ventas totales", value: COP.format(k.ventas_totales), accent: true },
    { label: "Facturas", value: NUM.format(k.num_facturas) },
    { label: "Unidades", value: NUM.format(k.unidades_vendidas) },
    { label: "Ticket prom.", value: COP.format(k.ticket_promedio) },
    { label: "Servicio top", value: k.servicio_top },
  ];
  document.getElementById("kpis").innerHTML = items.map(i => `
    <div class="kpi">
      <div class="label">${i.label}</div>
      <div class="value ${i.accent ? "accent" : ""}">${i.value}</div>
    </div>`).join("");
}

function renderTabla(filas) {
  document.getElementById("tblCount").textContent = `${filas.length} clientes`;
  document.querySelector("#tabla tbody").innerHTML = filas.map(f => `
    <tr>
      <td>${f.cliente}</td>
      <td class="num">${f.num_servicios}</td>
      <td class="num">${f.unidades}</td>
      <td class="num total">${COP.format(f.total_factura)}</td>
    </tr>`).join("");
}

function chartBar(data) {
  new Chart(document.getElementById("chartBar"), {
    type: "bar",
    data: {
      labels: data.map(d => d.servicio),
      datasets: [{
        data: data.map(d => d.ventas_total),
        backgroundColor: data.map((_, i) => PALETTE[i % PALETTE.length] + "cc"),
        borderColor: data.map((_, i) => PALETTE[i % PALETTE.length]),
        borderWidth: 1,
        borderRadius: 6,
        maxBarThickness: 46,
      }],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => COP.format(c.raw) } },
      },
      scales: {
        x: { grid: { color: "#1f2540" }, ticks: { callback: v => "$" + (v / 1e6) + "M" } },
        y: { grid: { display: false } },
      },
    },
  });
}

function chartDoughnut(data) {
  new Chart(document.getElementById("chartDough"), {
    type: "doughnut",
    data: {
      labels: data.map(d => d.servicio),
      datasets: [{
        data: data.map(d => d.ventas_total),
        backgroundColor: data.map((_, i) => PALETTE[i % PALETTE.length]),
        borderColor: "#0d111c",
        borderWidth: 3,
        hoverOffset: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "62%",
      plugins: {
        legend: {
          position: "bottom",
          labels: { boxWidth: 10, boxHeight: 10, padding: 10, usePointStyle: true },
        },
        tooltip: {
          callbacks: { label: c => `${c.label}: ${c.parsed.toLocaleString("es-CO")} (${data[c.dataIndex].pct_ventas}%)` },
        },
      },
    },
  });
}

(async function init() {
  try {
    const d = await cargarDatos();
    renderKpis(d.kpis);
    renderTabla(d.resumen_por_factura);
    chartBar(d.ventas_por_servicio);
    chartDoughnut(d.ventas_por_servicio);
  } catch (err) {
    document.querySelector(".grid").innerHTML =
      `<div class="card" style="grid-column:1/-1;justify-content:center;align-items:center;text-align:center">
        <p style="color:var(--muted)">${err.message}<br><br>
        Sírvelo con un servidor local:<br>
        <code style="color:var(--accent)">python -m http.server</code> y abre
        <code style="color:var(--accent)">/web/</code></p>
      </div>`;
    console.error(err);
  }
})();
