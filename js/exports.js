function descargarArchivoEmilio(nombre, contenido, tipo) {
  const blob = new Blob([contenido], { type: tipo });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombre;
  enlace.click();
  URL.revokeObjectURL(url);
}

function valorCsvChen(valor) {
  const texto = String(valor ?? "");
  return `"${texto.replaceAll('"', '""')}"`;
}

function generarCsvJosuc(series) {
  const columnas = [
    "id",
    "nombre",
    "descripcion",
    "categoria",
    "genero",
    "anio_lanzamiento",
    "temporadas",
    "estado",
    "plataforma",
    "creador",
    "pais_origen",
    "rating"
  ];

  const filas = series.map((serie) => columnas.map((columna) => {
    if (columna === "id") return valorCsvChen(idChen(serie));
    if (columna === "rating") return valorCsvChen(valorChen(serie, ["promedio_rating", "rating"], 0));
    return valorCsvChen(valorChen(serie, [columna], ""));
  }).join(","));

  return [columnas.join(","), ...filas].join("\n");
}

async function descargarCsvChen() {
  try {
    const csvBackend = await pedirChenin("/export/series.csv");
    descargarArchivoEmilio("series-chentoons.csv", csvBackend, "text/csv;charset=utf-8");
  } catch {
    const csvLocal = generarCsvJosuc(seriesChenin);
    descargarArchivoEmilio("series-chentoons.csv", csvLocal, "text/csv;charset=utf-8");
  }
}

function celdaExcelChen(valor) {
  const limpio = String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  return `<Cell><Data ss:Type="String">${limpio}</Data></Cell>`;
}

function descargarExcelEmilio() {
  const columnas = ["ID", "Nombre", "Categoria", "Genero", "Anio", "Temporadas", "Estado", "Plataforma", "Rating"];
  const filas = seriesChenin.map((serie) => [
    idChen(serie),
    valorChen(serie, ["nombre"], ""),
    valorChen(serie, ["categoria"], ""),
    valorChen(serie, ["genero"], ""),
    valorChen(serie, ["anio_lanzamiento", "anio"], ""),
    valorChen(serie, ["temporadas"], ""),
    valorChen(serie, ["estado"], ""),
    valorChen(serie, ["plataforma"], ""),
    valorChen(serie, ["promedio_rating", "rating"], 0)
  ]);

  const contenido = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="Series ChenToons">
  <Table>
   <Row>${columnas.map(celdaExcelChen).join("")}</Row>
   ${filas.map((fila) => `<Row>${fila.map(celdaExcelChen).join("")}</Row>`).join("")}
  </Table>
 </Worksheet>
</Workbook>`;

  descargarArchivoEmilio("series-chentoons.xlsx", contenido, "application/vnd.ms-excel;charset=utf-8");
}
