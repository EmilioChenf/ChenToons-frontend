document.addEventListener("DOMContentLoaded", iniciarChentoons);

async function iniciarChentoons() {
  document.getElementById("apiBaseTexto").textContent = API_CHENIN;
  conectarEventosChen();
  await probarApiChen();
  await cargarTodoChen();
}

function conectarEventosChen() {
  document.getElementById("btnNuevaSerie").addEventListener("click", () => abrirFormularioSerieChen());
  document.getElementById("btnRefrescar").addEventListener("click", cargarTodoChen);
  document.getElementById("formSerie").addEventListener("submit", manejarErrorChen(guardarSerieJosuc));
  document.getElementById("formPersonaje").addEventListener("submit", manejarErrorChen(guardarPersonajeJosuc));
  document.getElementById("formEpisodio").addEventListener("submit", manejarErrorChen(guardarEpisodioEmilio));
  document.getElementById("formRating").addEventListener("submit", manejarErrorChen(guardarRatingEmilio));
  document.getElementById("btnCsv").addEventListener("click", manejarErrorChen(descargarCsvChen));
  document.getElementById("btnExcel").addEventListener("click", descargarExcelEmilio);
  document.getElementById("paginaAnterior").addEventListener("click", () => cambiarPaginaChen(-1));
  document.getElementById("paginaSiguiente").addEventListener("click", () => cambiarPaginaChen(1));

  ["buscarTexto", "filtroGenero", "filtroEstado", "ordenSeries"].forEach((id) => {
    document.getElementById(id).addEventListener("input", () => {
      paginaChen = 1;
      pintarCardsChen();
    });
  });

  document.querySelectorAll("[data-cerrar]").forEach((boton) => {
    boton.addEventListener("click", () => cerrarModalChen(boton.dataset.cerrar));
  });
}

async function cargarTodoChen() {
  try {
    await Promise.all([cargarPersonajesChenin(), cargarEpisodiosChenin()]);
    await cargarSeriesChenin();
    toastChen("Datos actualizados");
  } catch (error) {
    toastChen(`No se pudo cargar la API: ${error.message}`);
    pintarCardsChen();
    pintarDashboardChen();
  }
}

async function probarApiChen() {
  const estado = document.getElementById("estadoApi");
  try {
    await revisarHealthChenin();
    estado.textContent = "Conectada";
  } catch {
    estado.textContent = "Sin conexion";
  }
}

function cambiarPaginaChen(movimiento) {
  paginaChen += movimiento;
  pintarCardsChen();
}

function cerrarModalChen(id) {
  const modal = document.getElementById(id);
  if (modal?.open) modal.close();
}

function toastChen(mensaje) {
  const toast = document.getElementById("toast");
  toast.textContent = mensaje;
  toast.classList.add("activo");
  clearTimeout(window.toonToastTiempo);
  window.toonToastTiempo = setTimeout(() => toast.classList.remove("activo"), 2800);
}

function manejarErrorChen(funcion) {
  return async function envolturaChen(evento) {
    try {
      await funcion(evento);
    } catch (error) {
      toastChen(error.message || "Ocurrio un error");
    }
  };
}
