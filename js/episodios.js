let episodiosChenin = [];
let episodiosSerieChen = [];

async function cargarEpisodiosChenin() {
  try {
    episodiosChenin = listaChen(await pedirChenin("/episodios"));
  } catch {
    episodiosChenin = [];
  }
}

async function cargarEpisodiosPorSerieChenin(serieId) {
  await cargarEpisodiosChenin();
  episodiosSerieChen = episodiosChenin.filter((e) => String(valorChen(e, ["serie_id", "series_id", "serieId"], "")) === String(serieId));
  pintarEpisodiosChen();
}

function pintarEpisodiosChen() {
  const lista = document.getElementById("listaEpisodios");
  if (!episodiosSerieChen.length) {
    lista.innerHTML = '<div class="vacio">No hay episodios registrados.</div>';
    return;
  }

  lista.innerHTML = episodiosSerieChen.map((e) => `
    <div class="item-mini">
      <div>
        <strong>${valorChen(e, ["titulo", "nombre"], "Sin titulo")}</strong>
        <small>Temporada ${valorChen(e, ["temporada"], "-")} - Episodio ${valorChen(e, ["numero", "numero_episodio"], "-")} ${valorChen(e, ["duracion"], "")}</small>
      </div>
      <div>
        <button class="btn btn-mini" onclick="editarEpisodioEmilio(${idChen(e)})">Editar</button>
        <button class="btn btn-mini" onclick="eliminarEpisodioEmilio(${idChen(e)})">Eliminar</button>
      </div>
    </div>
  `).join("");
}

function editarEpisodioEmilio(id) {
  const e = episodiosSerieChen.find((item) => String(idChen(item)) === String(id));
  if (!e) return;
  document.getElementById("episodioId").value = idChen(e);
  document.getElementById("episodioTitulo").value = valorChen(e, ["titulo", "nombre"], "");
  document.getElementById("episodioTemporada").value = valorChen(e, ["temporada"], "");
  document.getElementById("episodioNumero").value = valorChen(e, ["numero", "numero_episodio"], "");
  document.getElementById("episodioDuracion").value = valorChen(e, ["duracion"], "");
}

async function guardarEpisodioEmilio(evento) {
  evento.preventDefault();
  const id = document.getElementById("episodioId").value;
  const serieId = idChen(serieActualJosuc);
  const datos = {
    serie_id: Number(serieId),
    titulo: document.getElementById("episodioTitulo").value.trim(),
    temporada: Number(document.getElementById("episodioTemporada").value || 1),
    numero: Number(document.getElementById("episodioNumero").value || 1),
    duracion: document.getElementById("episodioDuracion").value.trim()
  };

  await pedirChenin(id ? `/episodios/${id}` : "/episodios", {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  });

  document.getElementById("formEpisodio").reset();
  toastChen("Episodio guardado");
  await cargarEpisodiosPorSerieChenin(serieId);
  pintarDashboardChen();
}

async function eliminarEpisodioEmilio(id) {
  if (!confirm("Eliminar episodio?")) return;
  await pedirChenin(`/episodios/${id}`, { method: "DELETE" });
  toastChen("Episodio eliminado");
  await cargarEpisodiosPorSerieChenin(idChen(serieActualJosuc));
  pintarDashboardChen();
}
