# MovieRadar

Catálogo de películas con Astro, Vue y Supabase.

## Requisitos

- Node.js 22.12 o posterior
- Proyecto Supabase con la tabla `public."Pelicula"`

## Configuración local

Desde la carpeta `Peliculas`:

```powershell
npm install
Copy-Item .env.example .env
```

Completa `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY` en `.env`. Son valores públicos; no expongas claves secretas.

RLS ya está configurado en el proyecto de Supabase: la lectura del catálogo es pública y las escrituras requieren una sesión autenticada. Esta aplicación no modifica las políticas de la base de datos.

```powershell
npm run dev
```

## Rutas y renderizado

- `/`: SSR público, búsqueda por título con `?q=` y paginación con `?page=`; los títulos aparecen en el HTML inicial.
- `/MovieForm` y `/MovieCard`: HTML SSG compartido; el CRUD consulta datos tras autenticar.
- `/login`, `/register`, `/about` y `/Navbar`: HTML SSG.
- Astro `ClientRouter` habilita View Transitions en la navegación interna.

Las películas forman un catálogo compartido entre los usuarios autenticados.

## Verificación

```powershell
npm run build
npm run preview
```

El adaptador `@astrojs/cloudflare` está configurado para Workers. No se realizó el despliegue y la URL pública queda pendiente.

## Taller 2

- Repositorio público: [PPE-Peliculas2](https://github.com/LReyes0307/PPE-Peliculas2)
- URL del Worker: pendiente de despliegue.
- Dry-run de Wrangler: `npx wrangler deploy --dry-run`.

