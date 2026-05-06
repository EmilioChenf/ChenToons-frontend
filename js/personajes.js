let personajesChenin = [];
let personajesSerieChen = [];

async function cargarPersonajesChenin() {
  try {
    personajesChenin = listaChen(await pedirChenin("/personajes"));
  } catch {
    personajesChenin = [];
  }
}

async function cargarPersonajesPorSerieChenin(serieId) {
  await cargarPersonajesChenin();
  personajesSerieChen = personajesChenin.filter((p) => String(valorChen(p, ["serie_id", "series_id", "serieId"], "")) === String(serieId));
  pintarPersonajesChen();
}

function pintarPersonajesChen() {
  const lista = document.getElementById("listaPersonajes");
  if (!personajesSerieChen.length) {
    lista.innerHTML = '<div class="vacio">No hay personajes registrados.</div>';
    return;
  }

  lista.innerHTML = personajesSerieChen.map((p) => `
    <div class="item-mini">
      <div>
        <strong>${valorChen(p, ["nombre"], "Sin nombre")}</strong>
        <small>${valorChen(p, ["rol"], "")} ${valorChen(p, ["descripcion"], "")}</small>
      </div>
      <div>
        <button class="btn btn-mini" onclick="editarPersonajeJosuc(${idChen(p)})">Editar</button>
        <button class="btn btn-mini" onclick="eliminarPersonajeJosuc(${idChen(p)})">Eliminar</button>
      </div>
    </div>
  `).join("");
}

function editarPersonajeJosuc(id) {
  const p = personajesSerieChen.find((item) => String(idChen(item)) === String(id));
  if (!p) return;
  document.getElementById("personajeId").value = idChen(p);
  document.getElementById("personajeNombre").value = valorChen(p, ["nombre"], "");
  document.getElementById("personajeRol").value = valorChen(p, ["rol"], "");
  document.getElementById("personajeDescripcion").value = valorChen(p, ["descripcion"], "");
}

async function guardarPersonajeJosuc(evento) {
  evento.preventDefault();
  const id = document.getElementById("personajeId").value;
  const serieId = idChen(serieActualJosuc);
  const datos = {
    serie_id: Number(serieId),
    nombre: document.getElementById("personajeNombre").value.trim(),
    rol: document.getElementById("personajeRol").value.trim(),
    descripcion: document.getElementById("personajeDescripcion").value.trim()
  };

  await pedirChenin(id ? `/personajes/${id}` : "/personajes", {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  });

  document.getElementById("formPersonaje").reset();
  toastChen("Personaje guardado");
  await cargarPersonajesPorSerieChenin(serieId);
  pintarDashboardChen();
}

async function eliminarPersonajeJosuc(id) {
  if (!confirm("Eliminar personaje?")) return;
  await pedirChenin(`/personajes/${id}`, { method: "DELETE" });
  toastChen("Personaje eliminado");
  await cargarPersonajesPorSerieChenin(idChen(serieActualJosuc));
  pintarDashboardChen();
}
