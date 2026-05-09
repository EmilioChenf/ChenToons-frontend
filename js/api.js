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

  return rutaSubidaChenin(respuesta);
}

const IMAGENES_BASE_CHENIN = new Set([
  "bluey.jpg",
  "chicas-superpoderosas.jpg",
  "craig.jpg",
  "dexter.jpg",
  "doraemon.jpg",
  "escandalosos.jpg",
  "gravity-falls.jpg",
  "gumball.jpg",
  "hey-arnold.jpg",
  "hora-aventura.jpg",
  "masha.jpg",
  "oggy.jpg",
  "peppa.jpg",
  "pocoyo.jpg",
  "pocoyo.png",
  "rugrats.jpg",
  "snoopy.jpg",
  "steven.jpg",
  "tom-jerry.jpg"
]);

function nombreArchivoChenin(ruta) {
  return String(ruta || "")
    .trim()
    .replace(/\\/g, "/")
    .split("?")[0]
    .split("#")[0]
    .split("/")
    .filter(Boolean)
    .pop() || "";
}

function urlUploadChenin(ruta) {
  const archivo = nombreArchivoChenin(ruta);
  return archivo ? `${API_CHENIN}/uploads/${encodeURIComponent(archivo)}` : "assets/placeholder.png";
}

function esImagenBaseChenin(ruta) {
  return IMAGENES_BASE_CHENIN.has(nombreArchivoChenin(ruta));
}

function urlImagenBaseChenin(ruta) {
  const archivo = nombreArchivoChenin(ruta);
  return archivo ? `/assets/images/${archivo}` : "/assets/placeholder.png";
}

function fallbackImagenChenin(ruta) {
  const archivo = nombreArchivoChenin(ruta);
  if (!archivo) return "/assets/placeholder.png";
  if (esImagenBaseChenin(ruta)) return urlUploadChenin(archivo);
  return `/assets/images/${archivo}`;
}

function manejarErrorImagenChenin(imagen) {
  const fallback = imagen.dataset.fallback;

  if (fallback && imagen.src !== fallback) {
    imagen.dataset.fallback = "";
    imagen.src = fallback;
    return;
  }

  imagen.onerror = null;
  imagen.src = "/assets/placeholder.png";
}

function rutaSubidaChenin(respuesta) {
  const datos = respuesta?.data || respuesta;
  const ruta = typeof datos === "string"
    ? datos
    : datos?.path || datos?.ruta || datos?.url || datos?.imageUrl || datos?.image_url || datos?.filePath || datos?.filepath || datos?.filename || datos?.file || datos?.nombre || "";
  const rutaLimpia = String(ruta || "").trim().replace(/\\/g, "/");
  const archivo = nombreArchivoChenin(rutaLimpia);

  if (!rutaLimpia) return "";
  if (rutaLimpia.startsWith("http")) return rutaLimpia;
  if (rutaLimpia.includes("/uploads/") || (!rutaLimpia.includes("/") && archivo)) return `/uploads/${archivo}`;
  return rutaLimpia;
}

function resolverImagenChenin(ruta) {
  if (!ruta) return "assets/placeholder.png";

  const rutaLimpia = String(ruta).trim().replace(/\\/g, "/");
  const archivo = nombreArchivoChenin(rutaLimpia);

  if (!rutaLimpia) return "assets/placeholder.png";
  if (rutaLimpia.startsWith("http")) return rutaLimpia;
  if (rutaLimpia.startsWith("assets/images/")) {
    return IMAGENES_BASE_CHENIN.has(archivo) ? urlImagenBaseChenin(archivo) : urlUploadChenin(archivo);
  }
  if (rutaLimpia.startsWith("/assets/images/")) {
    return IMAGENES_BASE_CHENIN.has(archivo) ? urlImagenBaseChenin(archivo) : urlUploadChenin(archivo);
  }
  if (rutaLimpia.startsWith("/uploads/")) return esImagenBaseChenin(rutaLimpia) ? urlImagenBaseChenin(rutaLimpia) : urlUploadChenin(rutaLimpia);
  if (rutaLimpia.startsWith("uploads/")) return esImagenBaseChenin(rutaLimpia) ? urlImagenBaseChenin(rutaLimpia) : urlUploadChenin(rutaLimpia);
  if (rutaLimpia.includes("/uploads/")) return esImagenBaseChenin(rutaLimpia) ? urlImagenBaseChenin(rutaLimpia) : urlUploadChenin(rutaLimpia);
  if (!rutaLimpia.includes("/") && !IMAGENES_BASE_CHENIN.has(rutaLimpia)) return urlUploadChenin(rutaLimpia);
  return `/assets/images/${rutaLimpia}`;
}

function rutaImagenChenin(ruta) {
  return resolverImagenChenin(ruta);
}
