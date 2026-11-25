# BlogpostFronter

Frontend de una aplicación de blog construido con **Angular 20**, consumidor de una API REST (ASP.NET Core) para autenticar, gestionar artículos, categorías e imágenes. El proyecto está orientado a mostrar el uso de las APIs modernas de Angular (signals, `httpResource`, detección de cambios *zoneless*, SSR/hidratación y formularios reactivos) en una aplicación real con zona pública y panel de administración protegido por roles.

## Funcionalidades

### Zona pública
- **Inicio (`/`)**: listado de artículos con búsqueda local reactiva por título, descripción corta y contenido, tarjetas responsive y estados de carga, error, sin resultados y lista vacía.
- **Detalle (`/blog/:slug`)**: artículo completo con fecha localizada en español, imagen destacada, galería con *lazy loading* y renderizado de contenido **Markdown**.
- **Registro (`/register`) y login (`/login`)**: formularios reactivos con validación, mensajes de error, mostrar/ocultar contraseña y estados de envío (`idle`, `loading`, `success`, `error`).
- **Navegación**: navbar responsive con menú móvil, dropdown de administración condicionado por rol, cierre con `Escape` / clic fuera y logout; footer con enlaces y año dinámico.

### Panel de administración (protegido por `adminGuard`)
- **Listado de artículos (`/admin/blogposts`)**: filtro por texto (título, descripción, autor, slug), filtro de visibilidad, ordenación (fecha, título A-Z/Z-A), paginación configurable (5/10/25/50), estadísticas desde la API y botón de reintento.
- **Alta de artículo (`/admin/blogposts/add`)**: formulario reactivo con validaciones, generación automática de *slug* a partir del título (normaliza acentos y caracteres), selector de categorías, galería dinámica con `FormArray`, imagen destacada, toggle de visibilidad y vista previa Markdown en vivo.
- **Edición y borrado (`/admin/blogposts/edit/:id`)**: precarga del artículo por `id`, conversión de fechas ISO a `datetime-local`, actualización, eliminación y reconstrucción de categorías e imágenes.
- **Listado de categorías (`/admin/categories`)**: búsqueda enviada al backend (`query`, `sortBy`, `sortOrder`), orden adicional local, paginación y contador servidor.
- **Alta y edición de categorías**: formularios reactivos con validación, Actualizar y Eliminar.

### Gestión de imágenes
- Modal reutilizable con **subida multipart**, **drag & drop**, **pegado de URL**, galería de imágenes ya almacenadas y preview local con `URL.createObjectURL`.
- Validación de tipo MIME (`image/`), extensiones permitidas (`.jpg`, `.jpeg`, `.png`, `.gif`) y tamaño máximo de 10 MB, alineada con el backend.
- Comunicación con los formularios mediante un servicio reactivo (`ImageUploadService`) con signals y callback.

### Seguridad y sesión
- Autenticación basada en **cookies** (`withCredentials: true`).
- Restauración de la sesión al recargar mediante `GET /api/auth/me` y sincronización con un signal global.
- Guard funcional `adminGuard`: redirige a `/login` si no hay usuario y solo permite roles `writer` o `admin`.
- Roles normalizados a minúsculas y UI del navbar adaptada al rol.

## Tecnologías usadas

| Tecnología | Uso en el proyecto |
|---|---|
| Angular 20.3 (standalone) | Componentes independientes, control flow `@if` / `@for` / `@empty`, `input()` signals |
| Signals y `httpResource` | Estado reactivo, recursos HTTP con `value`, `isLoading`, `error` y `reload()` |
| RxJS 7.8 | Observables para mutaciones, `tap`, `take`, estados de petición |
| Formularios reactivos | `FormBuilder`, `FormGroup`, `FormArray`, validadores y mensajes por control |
| Tailwind CSS 4 | Diseño responsive, animaciones, estados hover/focus, `prefers-reduced-motion` |
| ngx-markdown | Renderizado de Markdown en detalle y vista previa del editor |
| @lucide/angular | Iconos de la interfaz |
| TypeScript 5.9 | Modo estricto, `strictTemplates`, DTOs tipados |
| Angular SSR + hidratación | Renderizado selectivo por ruta y `withEventReplay()` |
| Karma + Jasmine | Pruebas unitarias |

## Arquitectura y estructura

Organización por funcionalidades (*feature-based*), con componentes compartidos en `core`:

```
src/app/
├── core/
│   ├── components/     # navbar, footer, tarjeta de post, detalle de post
│   └── pipes/          # truncate
├── features/
│   ├── auth/           # login, register, guard, modelo y servicio de autenticación
│   ├── blogPost/       # listado, alta, edición, selector de imágenes, servicios y modelos
│   ├── category/       # listado, alta, edición, servicio y modelos
│   └── public/         # home
├── app.config.ts       # router, HttpClient, Markdown, locale, SSR e hidratación
├── app.routes.ts       # rutas públicas y rutas /admin protegidas
└── app.ts              # shell: navbar, router-outlet, footer y carga de sesión
src/environments/       # configuración de la URL base de la API
```

### Decisiones técnicas destacadas
- **Detección de cambios zoneless** (`provideZonelessChangeDetection`), con `markForCheck()` allí donde actualizaciones externas a la plantilla lo requieren.
- **Parámetros de ruta como signals** mediante `withComponentInputBinding()`: `id` y `slug` alimentan `httpResource` sin suscripciones manuales.
- **Recursos HTTP reactivos**: las peticiones parametrizadas solo se ejecutan cuando existe el parámetro o cuando el modal está abierto, evitando llamadas innecesarias.
- **Mutaciones con signals de estado**: cada operación de alta/edición expone `idle | loading | success | error` y los `effect()` reaccionan navegando o limpiando el formulario.
- **Renderizado selectivo en SSR**: las rutas con datos dinámicos (`/blog/:slug`, edición) se renderizan en cliente; el resto se prerenderiza.
- **Locale español** registrado globalmente para fechas (`LOCALE_ID = 'es'`).
- **Timeout de 10 s** en los recursos HTTP del servicio de artículos y estados de error visibles en la UI.

## API REST consumida

Base: `http://localhost:5125` (configurable en `src/environments/`).

| Método | Endpoint | Funcionalidad |
|---|---|---|
| POST | `/api/Auth/Register` | Registro de usuario |
| POST | `/api/Auth/Login` | Inicio de sesión |
| GET | `/api/auth/me` | Restaurar usuario autenticado |
| POST | `/api/Auth/Logout` | Cerrar sesión |
| GET | `/api/BlogPosts` | Listado de artículos |
| GET | `/api/BlogPosts/count` | Total de artículos |
| GET | `/api/BlogPosts/{id}` | Artículo por id (edición) |
| GET | `/api/BlogPosts/{slug}` | Artículo por slug (detalle público) |
| POST / PUT / DELETE | `/api/BlogPosts` , `/api/BlogPosts/{id}` | Alta, actualización y borrado |
| GET | `/api/Categories` , `/api/Categories/count` , `/api/Categories/{id}` | Consulta de categorías |
| POST / PUT / DELETE | `/api/Categories` , `/api/Categories/{id}` | Alta, actualización y borrado |
| GET / POST | `/api/Images` | Galería y subida de imágenes |

Las operaciones de escritura usan credenciales (cookies de sesión).

## Requisitos e instalación

- Node.js compatible con Angular 20 y npm.
- API backend ejecutándose en `http://localhost:5125`.

```bash
npm install
npm start
```

Abrir `http://localhost:4200/`.

## Scripts

```bash
npm start      # servidor de desarrollo
npm run build  # build de producción en dist/
npm run watch  # build en modo desarrollo con recarga
npm test       # pruebas unitarias con Karma
```

Dentro de `src/environments/` se separan `environment.ts` (producción) y `environment.development.ts` (desarrollo), aplicando `angular.json` el reemplazo correspondiente según la configuración de build.

## Pruebas

Existe infraestructura de Karma/Jasmine con 11 archivos `.spec.ts` que verifican la creación de componentes, servicios, pipe y guard, además de renderizado básico del shell. Cubren la instanciación y configuración (zoneless, HttpClient, router, Markdown), por lo que son un punto de partida para ampliar cobertura en formularios, filtros, paginación, subida de imágenes y autorización.

## Para reclutadores

Este proyecto demuestra experiencia en:

- Angular moderno (20) con **standalone components**, **signals**, `computed`, `effect`, `input()` e `inject()`.
- Gestión de estado asíncrono con `httpResource` y patrones reactivos sin Zone.js.
- Formularios reactivos complejos: validación, `FormArray` dinámico, DTOs tipados, slugs normalizados y conversión de fechas.
- Implementación de CRUD completo contra una API REST real, con panel administrativo y control de acceso por roles.
- Autenticación con cookies, restauración de sesión y navegación protegida.
- Subida de archivos multipart con drag & drop, validación y galería remota.
- Renderizado Markdown y estilos dedicados para contenido enriquecido.
- SSR con hidratación y renderizado selectivo por ruta.
- Diseño responsive y accesible con Tailwind CSS 4.
- Arquitectura feature-based, tipado estricto y separación entre servicios, modelos y componentes.

## Posibles mejoras

- Centralizar la URL de la API para que los servicios usen el `environment` activo en lugar de importar directamente `environment.development.ts`.
- Ampliar las pruebas con casos funcionales (validaciones, búsqueda, paginación, guard y subida de imágenes).
- Unificar el uso de `input()` signal en la tarjeta de artículo, que hoy emplea `@Input()`.
- Añadir paginación en servidor y persistencia de filtros en la URL.
