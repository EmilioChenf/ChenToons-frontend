# ChenToons Frontend

ChenToons Frontend es un cliente web para explorar y administrar series animadas. Esta hecho con HTML, CSS y JavaScript vanilla, consume una API REST con `fetch()` y permite hacer CRUD completo de series. Tambien incluye ratings, filtros, personajes, episodios y exportaciones.

## Tecnologias usadas

- HTML
- CSS
- JavaScript Vanilla
- Fetch API
- Docker

## Como correr localmente

1. Clonar el repositorio frontend:

```bash
git clone https://github.com/EmilioChenf/ChenToons-frontend
cd ChenToons-frontend
```

2. Levantar el frontend con Docker:

```bash
docker compose up --build
```

3. Abrir en el navegador:

```text
http://localhost:3000
```

El backend debe estar corriendo en:

```text
http://localhost:8080
```

## Conexion con backend

El frontend consume el backend usando `fetch()` desde `js/api.js`. La URL base se configura en `js/config.js`.

Backend local:

```text
http://localhost:8080
```

Backend produccion:

```text
https://cheentoons-frontend.onrender.com/
```

Para cambiar la URL de produccion, editar:

```js
const CHENTOONS_RENDER_API = "https://cheentoons-frontend.onrender.com/";
```

Repositorio backend:

```text
https://github.com/EmilioChenf/ChenToons-backend
```

## Funcionalidades

- Listar series.
- Crear series.
- Editar series.
- Eliminar series.
- Ver ratings y agregar reseñas.
- Mostrar personajes por serie.
- Mostrar episodios por serie.
- Busqueda por texto.
- Filtros por genero y estado.
- Ordenamiento por nombre o año.
- Paginacion.
- Exportar CSV.
- Exportar Excel.
- Upload de imagenes.
- Imagenes base servidas desde `assets/images`.
- Diseño responsive para laptop y celular.

## Docker

El frontend se sirve con Nginx dentro de Docker. No necesita Node, npm ni `node_modules`.

Comando principal:

```bash
docker compose up --build
```

El contenedor publica el sitio en:

```text
http://localhost:3000
```

## Challenges implementados

### API y Backend

- API REST separada del frontend.
- Endpoints para listar, crear, editar y eliminar series.
- Paginacion con `page` y `limit`.
- Sistema de ratings por serie.
- Subida de imagenes con endpoint de uploads.
- Exportacion CSV desde endpoint del backend.
- Docker y Docker Compose para correr el proyecto.

### Frontend

- Consumo de API REST usando `fetch()`.
- CRUD completo de series desde la interfaz.
- Modal de detalles para ver serie, ratings, personajes y episodios.
- Busqueda en tiempo real.
- Filtros dinamicos por genero y estado.
- Ordenamiento visual por nombre o año.
- Paginacion visual de las cards.
- Exportacion CSV manual con JavaScript vanilla como respaldo.
- Exportacion Excel usando SpreadsheetML sin librerias externas.
- Upload de imagenes desde formulario.
- Imagenes base servidas desde `assets/images` para produccion.
- Diseño responsive para laptop y celular.

## Deploy

Frontend en Render:

```text
https://cheentoons-frontend.onrender.com/
```

Backend en Render:

```text
https://cheentoons-backend.onrender.com/
```

Configuracion recomendada para Render Static Site:

- Type: `Static Site`
- Build Command: dejar vacio
- Publish Directory: `.`

Importante: el backend debe permitir CORS desde la URL del frontend publicado.

## Screenshot

![ChenToons Frontend](screenshots/frontend.png)

## Reflexion

Trabajar con JavaScript vanilla hizo que entendieramos mejor como se conecta el frontend con una API sin depender de frameworks. Lo mas retador fue manejar varias partes al mismo tiempo: CRUD, ratings, uploads, filtros, paginacion y exportaciones. Docker ayudo a correr el proyecto de forma mas ordenada, y Render sirvio para preparar el frontend como un sitio estatico real. Tambien aprendimos que separar bien la URL de la API facilita pasar de localhost a produccion.

## Autor

Proyecto: ChenToons  
Autor: Emilio Josue Chen borrayo
