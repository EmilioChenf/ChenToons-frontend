const API_CHENIN = (window.CHENTOONS_CONFIG?.API_BASE || window.API_CHENIN || "").replace(/\/$/, "");

async function pedirChenin(ruta, opciones = {}) {
  const respuesta = await fetch(`${API_CHENIN}${ruta}`, opciones);

  if (!respuesta.ok) {
    const texto = await respuesta.text().catch(() => "");
    throw new Error(texto || `Error HTTP ${respuesta.status}`);
  }

  const tipo = respuesta.headers.get("content-type") || "";
  if (tipo.includes("application/json")) {
    return respuesta.json();
  }

  return respuesta.text();
}

function idChen(objeto) {
  return objeto?.id ?? objeto?.ID ?? objeto?._id;
}

function valorChen(objeto, nombres, defecto = "") {
  for (const nombre of nombres) {
    if (objeto && objeto[nombre] !== undefined && objeto[nombre] !== null) {
      return objeto[nombre];
    }
  }
  return defecto;
}

function listaChen(respuesta) {
  if (Array.isArray(respuesta)) return respuesta;
  if (Array.isArray(respuesta?.data)) return respuesta.data;
  if (Array.isArray(respuesta?.series)) return respuesta.series;
  if (Array.isArray(respuesta?.personajes)) return respuesta.personajes;
  if (Array.isArray(respuesta?.episodios)) return respuesta.episodios;
  return [];
}

async function revisarHealthChenin() {
  return pedirChenin("/health");
}

async function subirImagenChenin(archivo) {
  const datos = new FormData();
  datos.append("file", archivo);
  datos.append("imagen", archivo);
  datos.append("image", archivo);

  const respuesta = await pedirChenin("/uploads", {
    method: "POST",
    body: datos
  });

  if (typeof respuesta === "string") return respuesta;
  return respuesta.path || respuesta.ruta || respuesta.url || respuesta.filename || "";
}

function resolverImagenChenin(ruta) {
  if (!ruta) return "assets/placeholder.png";
  if (ruta.startsWith("http") || ruta.startsWith("assets/")) return ruta;
  if (ruta.startsWith("/uploads/")) return `assets/images/${ruta.split("/").pop()}`;
  if (ruta.startsWith("uploads/")) return `assets/images/${ruta.split("/").pop()}`;
  return `assets/images/${ruta}`;
}

function rutaImagenChenin(ruta) {
  return resolverImagenChenin(ruta);
}
