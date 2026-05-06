# ChenToons

ChenToons es un frontend universitario hecho con HTML, CSS y JavaScript vanilla para administrar series animadas, personajes, episodios, ratings y exportaciones. La idea visual mezcla cards tipo streaming con un dashboard moderno, usando colores pastel y una interfaz limpia.

## Como correr con Docker

Desde esta carpeta:

```bash
docker compose up --build
```

Luego abrir:

```text
http://localhost:3000
```

El backend Go + Fiber debe estar corriendo en:

```text
http://localhost:8080
```

## Conectar con el backend

La API base esta configurada en `js/api.js`:

```js
const API_CHENIN = window.API_CHENIN || "http://localhost:8080";
```

Si el backend usa otro puerto o dominio, se cambia esa linea. Tambien se puede definir antes desde `index.html`:

```html
<script>
  window.API_CHENIN = "http://localhost:8080";
</script>
```

## Funcionalidades

- Dashboard inicial con totales, series destacadas, promedio de rating y conteos.
- Cards de series con imagen, datos principales, detalle, editar y eliminar.
- Formulario para crear y editar series.
- Subida de imagen local usando `POST /uploads`.
- Busqueda, filtros por genero y estado, orden por nombre o anio, y paginacion.
- Gestion basica de personajes por serie.
- Gestion basica de episodios por serie.
- Rating de 1 a 5 con comentarios.
- Descarga CSV usando `GET /export/series.csv` o datos cargados.
- Descarga Excel `.xlsx` compatible, generado sin librerias externas.
- Diseno responsive para laptop y celular.

## Screenshots pendientes

- Dashboard general.
- Cards de series.
- Modal de detalle con personajes, episodios y ratings.
- Vista responsive en celular.

## Reflexion breve

El frontend se hizo simple a proposito: usa archivos separados por responsabilidad y funciones con nombres faciles de reconocer. No se uso ningun framework para que el proyecto sea entendible, modificable y facil de explicar paso a paso.
