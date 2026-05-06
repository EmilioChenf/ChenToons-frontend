let seriesChenin = [];
let paginaChen = 1;
let serieActualJosuc = null;
const porPaginaChen = 8;

async function cargarSeriesChenin() {
  const respuesta = await pedirChenin("/series");
  seriesChenin = listaChen(respuesta);
  await completarPromediosChen();
  llenarFiltrosChen();
  pintarDashboardChen();
  pintarCardsChen();
}

async function completarPromediosChen() {
  const promesas = seriesChenin.map(async (serie) => {
    const id = idChen(serie);
    if (!id) return;
    try {
      const datos = await pedirChenin(`/series/${id}/promedio-rating`);
      serie.promedio_rating = typeof datos === "number"
        ? datos
        : Number(valorChen(datos, ["promedio", "promedio_rating", "rating", "average"], 0));
    } catch {
      serie.promedio_rating = Number(valorChen(serie, ["promedio_rating", "rating_promedio", "rating"], 0));
    }
  });
  await Promise.all(promesas);
}

function pintarDashboardChen() {
  const destacadas = seriesChenin.filter((serie) => Boolean(valorChen(serie, ["destacada", "es_destacada"], false)));
  const ratings = seriesChenin.map((serie) => Number(valorChen(serie, ["promedio_rating", "rating"], 0))).filter(Boolean);
  const promedio = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

  document.getElementById("totalSeries").textContent = seriesChenin.length;
  document.getElementById("seriesDestacadas").textContent = destacadas.length;
  document.getElementById("ratingGeneral").textContent = promedio.toFixed(1);
  document.getElementById("totalExtras").textContent = `${personajesChenin.length} / ${episodiosChenin.length}`;
}

function llenarFiltrosChen() {
  const select = document.getElementById("filtroGenero");
  const actual = select.value;
  const generos = [...new Set(seriesChenin.map((s) => valorChen(s, ["genero"], "")).filter(Boolean))].sort();

  select.innerHTML = '<option value="">Todos</option>';
  generos.forEach((genero) => {
    const option = document.createElement("option");
    option.value = genero;
    option.textContent = genero;
    select.appendChild(option);
  });
  select.value = actual;
}

function filtrarSeriesChen() {
  const texto = document.getElementById("buscarTexto").value.trim().toLowerCase();
  const genero = document.getElementById("filtroGenero").value;
  const estado = document.getElementById("filtroEstado").value;
  const orden = document.getElementById("ordenSeries").value;

  const filtradas = seriesChenin.filter((serie) => {
    const nombre = valorChen(serie, ["nombre"], "").toLowerCase();
    const descripcion = valorChen(serie, ["descripcion"], "").toLowerCase();
    const generoSerie = valorChen(serie, ["genero"], "");
    const estadoSerie = valorChen(serie, ["estado"], "");
    const coincideTexto = !texto || nombre.includes(texto) || descripcion.includes(texto) || generoSerie.toLowerCase().includes(texto);
    return coincideTexto && (!genero || generoSerie === genero) && (!estado || estadoSerie === estado);
  });

  filtradas.sort((a, b) => {
    if (orden === "anio") {
      return Number(valorChen(b, ["anio_lanzamiento", "anio"], 0)) - Number(valorChen(a, ["anio_lanzamiento", "anio"], 0));
    }
    return valorChen(a, ["nombre"], "").localeCompare(valorChen(b, ["nombre"], ""));
  });

  return filtradas;
}

function pintarCardsChen() {
  const grid = document.getElementById("gridSeries");
  const filtradas = filtrarSeriesChen();
  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / porPaginaChen));
  if (paginaChen > totalPaginas) paginaChen = totalPaginas;

  const inicio = (paginaChen - 1) * porPaginaChen;
  const pagina = filtradas.slice(inicio, inicio + porPaginaChen);

  document.getElementById("paginaActual").textContent = `${paginaChen} / ${totalPaginas}`;
  document.getElementById("resumenLista").textContent = `${filtradas.length} serie(s) encontradas`;
  document.getElementById("paginaAnterior").disabled = paginaChen <= 1;
  document.getElementById("paginaSiguiente").disabled = paginaChen >= totalPaginas;

  if (!pagina.length) {
    grid.innerHTML = '<div class="vacio">No hay series para mostrar.</div>';
    return;
  }

  grid.innerHTML = pagina.map((serie) => {
    const id = idChen(serie);
    const nombre = valorChen(serie, ["nombre"], "Sin nombre");
    const genero = valorChen(serie, ["genero"], "Sin genero");
    const categoria = valorChen(serie, ["categoria"], "Serie");
    const temporadas = valorChen(serie, ["temporadas"], 0);
    const estado = valorChen(serie, ["estado"], "Sin estado");
    const rating = Number(valorChen(serie, ["promedio_rating", "rating"], 0)).toFixed(1);
    const imagen = rutaImagenChenin(valorChen(serie, ["imagen", "image"], ""));
    const destacada = valorChen(serie, ["destacada", "es_destacada"], false);

    return `
      <article class="serie-card">
        <div class="serie-img">
          <img src="${imagen}" alt="${nombre}" onerror="this.src='assets/placeholder.png'">
          ${destacada ? '<span class="badge badge-flotante">Destacada</span>' : ""}
        </div>
        <div class="serie-body">
          <h3>${nombre}</h3>
          <div class="meta">
            <span>${genero}</span>
            <span>${categoria}</span>
            <span>${temporadas} temp.</span>
            <span>${estado}</span>
            <span>${rating} estrellas</span>
          </div>
          <div class="acciones-card">
            <button class="btn btn-principal" onclick="verDetalleChen(${id})">Ver detalle</button>
            <button class="btn btn-suave" onclick="editarSerieChen(${id})">Editar</button>
            <button class="btn btn-alerta" onclick="eliminarSerieChen(${id})">Eliminar</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function abrirFormularioSerieChen(serie = null) {
  document.getElementById("formSerie").reset();
  document.getElementById("serieColor").value = "#4ECDC4";
  document.getElementById("serieId").value = "";
  document.getElementById("tituloFormSerie").textContent = serie ? "Editar serie" : "Nueva serie";

  if (serie) {
    document.getElementById("serieId").value = idChen(serie);
    document.getElementById("serieNombre").value = valorChen(serie, ["nombre"], "");
    document.getElementById("serieDescripcion").value = valorChen(serie, ["descripcion"], "");
    document.getElementById("serieCategoria").value = valorChen(serie, ["categoria"], "");
    document.getElementById("serieGenero").value = valorChen(serie, ["genero"], "");
    document.getElementById("serieAnio").value = valorChen(serie, ["anio_lanzamiento", "anio"], "");
    document.getElementById("serieTemporadas").value = valorChen(serie, ["temporadas"], "");
    document.getElementById("serieEstado").value = valorChen(serie, ["estado"], "En emision");
    document.getElementById("seriePlataforma").value = valorChen(serie, ["plataforma"], "");
    document.getElementById("serieCreador").value = valorChen(serie, ["creador"], "");
    document.getElementById("seriePais").value = valorChen(serie, ["pais_origen"], "");
    document.getElementById("serieImagen").value = valorChen(serie, ["imagen"], "");
    document.getElementById("serieColor").value = valorChen(serie, ["color_tema"], "#4ECDC4");
    document.getElementById("serieDestacada").checked = Boolean(valorChen(serie, ["destacada", "es_destacada"], false));
  }

  document.getElementById("modalSerie").showModal();
}

function editarSerieChen(id) {
  const serie = seriesChenin.find((item) => String(idChen(item)) === String(id));
  abrirFormularioSerieChen(serie);
}

async function guardarSerieJosuc(evento) {
  evento.preventDefault();
  const id = document.getElementById("serieId").value;
  let imagen = document.getElementById("serieImagen").value.trim();
  const archivo = document.getElementById("serieImagenArchivo").files[0];

  if (archivo) {
    imagen = await subirImagenChenin(archivo);
  }

  const datos = {
    nombre: document.getElementById("serieNombre").value.trim(),
    descripcion: document.getElementById("serieDescripcion").value.trim(),
    categoria: document.getElementById("serieCategoria").value.trim(),
    genero: document.getElementById("serieGenero").value.trim(),
    anio_lanzamiento: Number(document.getElementById("serieAnio").value || 0),
    temporadas: Number(document.getElementById("serieTemporadas").value || 1),
    estado: document.getElementById("serieEstado").value,
    plataforma: document.getElementById("seriePlataforma").value.trim(),
    creador: document.getElementById("serieCreador").value.trim(),
    pais_origen: document.getElementById("seriePais").value.trim(),
    imagen,
    color_tema: document.getElementById("serieColor").value,
    destacada: document.getElementById("serieDestacada").checked
  };

  await pedirChenin(id ? `/series/${id}` : "/series", {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  });

  cerrarModalChen("modalSerie");
  toastChen("Serie guardada");
  await cargarSeriesChenin();
}

async function eliminarSerieChen(id) {
  if (!confirm("Seguro que quieres eliminar esta serie?")) return;
  await pedirChenin(`/series/${id}`, { method: "DELETE" });
  toastChen("Serie eliminada");
  await cargarSeriesChenin();
}

async function verDetalleChen(id) {
  const local = seriesChenin.find((item) => String(idChen(item)) === String(id));
  try {
    serieActualJosuc = await pedirChenin(`/series/${id}`);
  } catch {
    serieActualJosuc = local;
  }

  if (!serieActualJosuc) return;
  const idSerie = idChen(serieActualJosuc) || id;
  console.log("ID serie detalle:", idSerie);
  document.getElementById("detalleTitulo").textContent = valorChen(serieActualJosuc, ["nombre"], "Detalle");
  pintarDetalleSerieChen();
  await cargarPersonajesPorSerieChenin(idSerie);
  await cargarEpisodiosPorSerieChenin(idSerie);
  await cargarRatingsSerieChenin(idSerie);
  pintarComentariosChen(serieActualJosuc);
  const modal = document.getElementById("modalDetalle");
  if (!modal.open) modal.showModal();
}

function pintarDetalleSerieChen() {
  const serie = serieActualJosuc;
  const imagen = rutaImagenChenin(valorChen(serie, ["imagen"], ""));
  document.getElementById("detalleSerie").innerHTML = `
    <img src="${imagen}" alt="${valorChen(serie, ["nombre"], "")}" onerror="this.src='assets/placeholder.png'">
    <div>
      <p>${valorChen(serie, ["descripcion"], "Sin descripcion")}</p>
      <div class="meta">
        <span>${valorChen(serie, ["genero"], "Genero")}</span>
        <span>${valorChen(serie, ["categoria"], "Categoria")}</span>
        <span>${valorChen(serie, ["anio_lanzamiento", "anio"], "Anio")}</span>
        <span>${valorChen(serie, ["plataforma"], "Plataforma")}</span>
        <span>${Number(valorChen(serie, ["promedio_rating", "rating"], 0)).toFixed(1)} estrellas</span>
      </div>
    </div>
  `;
}

async function guardarRatingEmilio(evento) {
  evento.preventDefault();
  const id = idChen(serieActualJosuc);
  const datos = {
    puntuacion: Number(document.getElementById("ratingValor").value),
    rating: Number(document.getElementById("ratingValor").value),
    comentario: document.getElementById("ratingComentario").value.trim()
  };

  await pedirChenin(`/series/${id}/ratings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  });

  document.getElementById("ratingComentario").value = "";
  toastChen("Rating agregado");

  await refrescarRatingSerieChen(id);
}

function pintarComentariosChen(serie) {
  const comentarios = valorChen(serie, ["ratings", "comentarios"], []);
  const caja = document.getElementById("comentariosRating");
  if (!Array.isArray(comentarios) || !comentarios.length) {
    caja.innerHTML = '<div class="vacio">Sin comentarios recientes.</div>';
    return;
  }

  caja.innerHTML = comentarios.slice().reverse().map((item) => `
    <div class="item-mini">
      <div>
        <strong>${valorChen(item, ["puntuacion", "rating", "calificacion", "valor"], 0)} estrellas</strong>
        <small>${valorChen(item, ["comentario", "comment", "texto", "descripcion"], "Sin comentario")}</small>
      </div>
    </div>
  `).join("");
}

function normalizarRatingsChen(respuesta) {
  if (Array.isArray(respuesta)) return respuesta;
  if (Array.isArray(respuesta?.data)) return respuesta.data;
  if (Array.isArray(respuesta?.ratings)) return respuesta.ratings;
  if (Array.isArray(respuesta?.comentarios)) return respuesta.comentarios;
  return [];
}

async function cargarRatingsSerieChenin(idSerie) {
  let ratings = [];

  try {
    const respuesta = await pedirChenin(`/series/${idSerie}/ratings`);
    ratings = normalizarRatingsChen(respuesta);
  } catch {
    ratings = [];
  }

  console.log("Ratings recibidos:", ratings);
  serieActualJosuc.ratings = ratings;
  serieActualJosuc.comentarios = ratings;
  return ratings;
}

async function refrescarRatingSerieChen(id) {
  let serieActualizada = null;

  try {
    serieActualizada = await pedirChenin(`/series/${id}`);
  } catch {
    serieActualizada = serieActualJosuc;
  }

  try {
    const promedio = await pedirChenin(`/series/${id}/promedio-rating`);
    serieActualizada.promedio_rating = typeof promedio === "number"
      ? promedio
      : Number(valorChen(promedio, ["promedio", "promedio_rating", "rating", "average"], 0));
  } catch {
    serieActualizada.promedio_rating = Number(valorChen(serieActualizada, ["promedio_rating", "rating"], 0));
  }

  serieActualJosuc = serieActualizada;
  await cargarRatingsSerieChenin(id);

  const indice = seriesChenin.findIndex((serie) => String(idChen(serie)) === String(id));
  if (indice >= 0) {
    seriesChenin[indice] = { ...seriesChenin[indice], ...serieActualizada };
  }

  pintarDetalleSerieChen();
  pintarComentariosChen(serieActualJosuc);
  pintarDashboardChen();
  pintarCardsChen();
}
