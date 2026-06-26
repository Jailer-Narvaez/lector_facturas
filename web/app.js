// SPA demo: login + módulo de carga + dashboard. Paleta Davrant.

// ====================== Config / utils ======================
const DEMO_USER = { email: "admin@davrant.com", password: "demo123" };
const PALETTE = ["#229cc0", "#00e5ff", "#7c5cff", "#ffb020", "#ff3366"];
const COP = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const NUM = new Intl.NumberFormat("es-CO");

Chart.defaults.color = "#7a83a8";
Chart.defaults.font.family = "Inter, system-ui, sans-serif";
Chart.defaults.font.size = 11;

const $ = (sel) => document.querySelector(sel);

// ====================== Autenticación (demo) ======================
function login(email, password) {
  if (email.trim().toLowerCase() === DEMO_USER.email && password === DEMO_USER.password) {
    sessionStorage.setItem("demo_user", DEMO_USER.email);
    return true;
  }
  return false;
}

function entrarApp(email) {
  $("#view-login").classList.add("hidden");
  $("#view-app").classList.remove("hidden");
  $("#sideUser").textContent = email;
}

function logout() {
  sessionStorage.removeItem("demo_user");
  location.reload();
}

// ====================== Navegación entre módulos ======================
let dashboardListo = false;

function mostrarPanel(nombre) {
  document.querySelectorAll(".panel").forEach((p) => p.classList.add("hidden"));
  $(`#panel-${nombre}`).classList.remove("hidden");
  document.querySelectorAll(".nav-item").forEach((b) =>
    b.classList.toggle("active", b.dataset.panel === nombre)
  );
  if (nombre === "dashboard" && !dashboardListo) initDashboard();
}

// ====================== Módulo: cargar facturas ======================
const archivos = [];

function bytes(n) {
  return n < 1024 * 1024 ? `${(n / 1024).toFixed(0)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function agregarArchivos(lista) {
  for (const f of lista) {
    if (f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")) {
      if (!archivos.some((a) => a.name === f.name && a.size === f.size)) archivos.push(f);
    }
  }
  renderArchivos();
}

function renderArchivos() {
  $("#fileList").innerHTML = archivos.map((f, i) => `
    <li class="file-item">
      <span class="file-ico">PDF</span>
      <span class="file-name">${f.name}</span>
      <span class="file-size">${bytes(f.size)}</span>
      <button class="file-del" data-i="${i}" title="Quitar">✕</button>
    </li>`).join("");
  $("#filesCount").textContent = archivos.length ? `${archivos.length} archivo(s)` : "";
  $("#processBtn").disabled = archivos.length === 0;
}

function initUpload() {
  const dz = $("#dropzone");
  const input = $("#fileInput");

  dz.addEventListener("click", () => input.click());
  input.addEventListener("change", () => agregarArchivos(input.files));

  ["dragover", "dragenter"].forEach((ev) =>
    dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add("over"); })
  );
  ["dragleave", "drop"].forEach((ev) =>
    dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove("over"); })
  );
  dz.addEventListener("drop", (e) => agregarArchivos(e.dataTransfer.files));

  $("#fileList").addEventListener("click", (e) => {
    const btn = e.target.closest(".file-del");
    if (!btn) return;
    archivos.splice(+btn.dataset.i, 1);
    renderArchivos();
  });

  $("#processBtn").addEventListener("click", procesar);
}

async function procesar() {
  const btn = $("#processBtn");
  btn.disabled = true;
  btn.textContent = "Procesando…";
  try {
    // Envía los PDF al backend FastAPI, que regenera output/analisis.json
    // y devuelve el reporte ya calculado.
    const fd = new FormData();
    archivos.forEach((f) => fd.append("files", f));
    const res = await fetch("/api/procesar", { method: "POST", body: fd });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e.detail || `Error del servidor (${res.status})`);
    }
    const data = await res.json();
    renderDashboard(data.reporte);
    dashboardListo = true;
    mostrarPanel("dashboard");
  } catch (err) {
    alert("No se pudo procesar.\n" + err.message +
      "\n\n¿Está corriendo el backend?  uvicorn api:app --port 8000");
    console.error(err);
  } finally {
    btn.textContent = "Procesar facturas";
    btn.disabled = archivos.length === 0;
  }
}

// ====================== Módulo: dashboard ======================
async function cargarDatos() {
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
  $("#kpis").innerHTML = items.map((i) => `
    <div class="kpi">
      <div class="label">${i.label}</div>
      <div class="value ${i.accent ? "accent" : ""}">${i.value}</div>
    </div>`).join("");
}

function renderTabla(filas) {
  $("#tblCount").textContent = `${filas.length} clientes`;
  $("#tabla tbody").innerHTML = filas.map((f) => `
    <tr>
      <td>${f.cliente}</td>
      <td class="num">${f.num_servicios}</td>
      <td class="num">${f.unidades}</td>
      <td class="num total">${COP.format(f.total_factura)}</td>
    </tr>`).join("");
}

let barRef, doughRef;

function chartBar(data) {
  if (barRef) barRef.destroy();
  barRef = new Chart($("#chartBar"), {
    type: "bar",
    data: {
      labels: data.map((d) => d.servicio),
      datasets: [{
        data: data.map((d) => d.ventas_total),
        backgroundColor: data.map((_, i) => PALETTE[i % PALETTE.length] + "cc"),
        borderColor: data.map((_, i) => PALETTE[i % PALETTE.length]),
        borderWidth: 1, borderRadius: 6, maxBarThickness: 46,
      }],
    },
    options: {
      indexAxis: "y", responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => COP.format(c.raw) } } },
      scales: {
        x: { grid: { color: "#1f2540" }, ticks: { callback: (v) => "$" + v / 1e6 + "M" } },
        y: { grid: { display: false } },
      },
    },
  });
}

function chartDoughnut(data) {
  if (doughRef) doughRef.destroy();
  doughRef = new Chart($("#chartDough"), {
    type: "doughnut",
    data: {
      labels: data.map((d) => d.servicio),
      datasets: [{
        data: data.map((d) => d.ventas_total),
        backgroundColor: data.map((_, i) => PALETTE[i % PALETTE.length]),
        borderColor: "#0d111c", borderWidth: 3, hoverOffset: 6,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: "62%",
      plugins: {
        legend: { position: "bottom", labels: { boxWidth: 10, boxHeight: 10, padding: 10, usePointStyle: true } },
        tooltip: { callbacks: { label: (c) => `${c.label}: ${c.parsed.toLocaleString("es-CO")} (${data[c.dataIndex].pct_ventas}%)` } },
      },
    },
  });
}

function renderDashboard(d) {
  renderKpis(d.kpis);
  renderTabla(d.resumen_por_factura);
  chartBar(d.ventas_por_servicio);
  chartDoughnut(d.ventas_por_servicio);
}

async function initDashboard() {
  try {
    const d = await cargarDatos();
    renderDashboard(d);
    dashboardListo = true;
  } catch (err) {
    $(".grid").innerHTML =
      `<div class="card" style="grid-column:1/-1;justify-content:center;align-items:center;text-align:center">
        <p style="color:var(--muted)">${err.message}<br><br>
        Sírvelo con un servidor local:<br>
        <code style="color:var(--accent)">python -m http.server</code> y abre
        <code style="color:var(--accent)">/web/</code></p>
      </div>`;
    console.error(err);
  }
}

// ====================== Arranque ======================
document.addEventListener("DOMContentLoaded", () => {
  // Login
  $("#loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("#email").value, pass = $("#password").value;
    if (login(email, pass)) entrarApp(email);
    else $("#loginError").textContent = "Credenciales inválidas. Usa las del demo.";
  });

  $("#logoutBtn").addEventListener("click", logout);
  document.querySelectorAll(".nav-item").forEach((b) =>
    b.addEventListener("click", () => mostrarPanel(b.dataset.panel))
  );

  initUpload();

  // Sesión persistente (demo)
  const guardado = sessionStorage.getItem("demo_user");
  if (guardado) entrarApp(guardado);
});
