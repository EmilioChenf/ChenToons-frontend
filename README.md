# ChenToons Frontend

ChenToons es un cliente web separado para administrar series animadas, personajes, episodios, ratings, uploads y exportaciones. Esta hecho con HTML, CSS y JavaScript vanilla: no usa React, Vue, Angular, jQuery, Axios ni librerias externas.

## URLs del proyecto

- Frontend local: `http://localhost:3000`
- Backend local: `http://localhost:8080`
- Frontend produccion Render: `https://NOMBRE-FRONTEND.onrender.com`
- Backend produccion Render: `https://NOMBRE-BACKEND.onrender.com`
- Repo backend: pendiente de colocar aqui el enlace del repositorio backend.

Antes de publicar, reemplazar `NOMBRE-BACKEND` y `NOMBRE-FRONTEND` por los nombres reales de Render.

## Configurar API

La API base esta centralizada en `js/config.js`.

```js
const CHENTOONS_LOCAL_API = "http://localhost:8080";
const CHENTOONS_RENDER_API = "https://NOMBRE-BACKEND.onrender.com";
```

El frontend detecta automaticamente:

- Si corre en `localhost` o `127.0.0.1`, usa `http://localhost:8080`.
- Si corre en Render u otro dominio, usa `CHENTOONS_RENDER_API`.

Para deploy final solo hay que cambiar esta linea:

```js
const CHENTOONS_RENDER_API = "https://TU-BACKEND-REAL.onrender.com";
```

Todas las llamadas pasan por `js/api.js`, usando `fetch()` y la constante `API_CHENIN`.

## Correr local con Docker

```bash
docker compose up --build
```

Abrir:

```text
http://localhost:3000
```

El backend debe estar corriendo en:

```text
http://localhost:8080
```

## Correr sin Docker

Como es un sitio estatico, tambien puede abrirse con un servidor local simple o desde Live Server. El archivo de entrada es:

```text
index.html
```

## Deploy en Render Static Site

Configuracion recomendada:

- Type: `Static Site`
- Root Directory: dejar vacio si el repo apunta a esta carpeta, o colocar la carpeta del frontend si esta dentro de un monorepo.
- Build Command: dejar vacio
- Publish Directory: `.`

No necesita Node server, npm, build step ni `node_modules`.

Importante para CORS:

- El backend en Render debe permitir el origen del frontend, por ejemplo `https://NOMBRE-FRONTEND.onrender.com`.
- En local debe permitir `http://localhost:3000`.

## Funcionalidades

- Dashboard inicial con total de series, destacadas, rating general y conteos.
- Cards de series con imagen, nombre, genero, categoria, temporadas, estado y rating.
- Crear, editar y eliminar series.
- Upload de imagenes con `POST /uploads`.
- Imagenes cargadas desde `/uploads/:filename` usando la API base configurada.
- Busqueda, filtros, ordenamiento y paginacion local.
- Detalle de serie con personajes, episodios y ratings.
- Crear, editar y eliminar personajes.
- Crear, editar y eliminar episodios.
- Agregar rating y comentario.
- Descargar CSV desde `GET /export/series.csv` o fallback local.
- Descargar Excel compatible sin librerias externas.
- Responsive para laptop, tablet y celular.

## Challenges implementados

- Cliente separado del backend.
- JavaScript vanilla con `fetch()`.
- CRUD completo de series.
- Upload de imagenes.
- Ratings y comentarios por serie.
- Personajes y episodios asociados.
- Busqueda, filtros, ordenamiento y paginacion.
- Exportacion CSV y Excel sin dependencias externas.
- Docker para correr el frontend.
- Preparacion para Render Static Site.

## Pruebas finales sugeridas

1. Listar series.
2. Crear serie.
3. Editar serie.
4. Eliminar serie de prueba.
5. Subir imagen.
6. Abrir detalle de serie.
7. Agregar rating y comentario.
8. Crear, editar y eliminar personaje.
9. Crear, editar y eliminar episodio.
10. Probar busqueda.
11. Probar filtros.
12. Probar ordenamiento.
13. Probar paginacion.
14. Descargar CSV.
15. Descargar Excel.
16. Probar responsive en movil.

## Screenshots

Pendientes:

- Dashboard general.
- Cards de series.
- Modal de detalle con personajes, episodios y ratings.
- Vista responsive en celular.

## Reflexion

El frontend se mantuvo simple para que sea facil de explicar en clase. La separacion por archivos ayuda a ubicar cada parte: `api.js` para comunicacion con backend, `series.js` para catalogo y detalle, `personajes.js` y `episodios.js` para datos relacionados, y `exports.js` para descargas. Los challenges mas delicados fueron mantener la app sin librerias externas, manejar uploads y preparar la misma base de codigo para localhost y Render.
