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

Aplica `supabase/migrations/20261001000000_pelicula_rls.sql` desde el SQL Editor de Supabase. La prueba pgTAP está en `supabase/tests/pelicula_rls.test.sql` y se ejecuta con `supabase test db` si Supabase CLI está enlazado al proyecto y pgTAP habilitado.

```powershell
npm run dev
```

## Rutas y renderizado

- `/`: SSR público, búsqueda por título con `?q=` y paginación con `?page=`; los títulos aparecen en el HTML inicial.
- `/MovieForm` y `/MovieCard`: HTML SSG compartido; el CRUD consulta datos tras autenticar.
- `/login`, `/register`, `/about` y `/Navbar`: HTML SSG.
- Astro `ClientRouter` habilita View Transitions en la navegación interna.

RLS permite lectura pública y reserva las escrituras a usuarios autenticados. Las películas forman un catálogo compartido.

## Verificación

```powershell
npm run build
npm run preview
```

El adaptador `@astrojs/cloudflare` está configurado para Workers. No se realizó el despliegue y la URL pública queda pendiente.

## Taller 2

Consulta [`Taller-2-Guia.md`](Taller-2-Guia.md) para el mapa de requisitos, cómo explicarlos en clase, la demostración sugerida y las rutas de implementación.

- Repositorio público: [PPE-Peliculas2](https://github.com/LReyes0307/PPE-Peliculas2)
- URL del Worker: pendiente de despliegue.
- Dry-run de Wrangler: `npx wrangler deploy --dry-run`.

