import { defineMiddleware } from 'astro:middleware';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';

// Crea la sesión Supabase y protege las rutas de la API CRUD.
export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  const staticPaths = [
    '/about',
    '/login',
    '/register',
    '/MovieCard',
    '/MovieForm',
    '/Navbar',
  ];
  const isStaticOrInternal =
    pathname.startsWith('/_astro') ||
    pathname.startsWith('/@fs') ||
    pathname.startsWith('/@vite') ||
    pathname.startsWith('/_image') ||
    /\.[a-zA-Z0-9]+$/.test(pathname);

  if (isStaticOrInternal || staticPaths.includes(normalizedPath)) {
    return next();
  }

  const supabaseUrl = import.meta.env.SUPABASE_URL;
  const supabasePublishableKey = import.meta.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      'Configura SUPABASE_URL y SUPABASE_PUBLISHABLE_KEY en el archivo .env.'
    );
  }

  const cookieHeader = context.request.headers.get('Cookie') ?? '';
  const parsedCookies = parseCookieHeader(cookieHeader);

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return parsedCookies;
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          context.cookies.set(name, value, options);
        });
      },
    },
  });

  context.locals.supabase = supabase;

  // Optimize: only validate with Supabase if auth cookies are present
  const hasAuthCookie = parsedCookies.some((c) => c.name.startsWith('sb-'));

  let user = null;
  if (hasAuthCookie) {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  context.locals.user = user;

  const isPublicRoute =
    normalizedPath === '/' ||
    normalizedPath === '/MovieFilters' ||
    normalizedPath === '/login' ||
    normalizedPath === '/register';
  const isAuthRoute =
    normalizedPath === '/login' || normalizedPath === '/register';
  const isApiRoute = normalizedPath.startsWith('/api');

  // If user is not authenticated
  if (!user) {
    if (isPublicRoute) {
      return next();
    }
    if (isApiRoute) {
      return new Response(
        JSON.stringify({ error: 'No autorizado. Debes iniciar sesión.' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    return context.redirect('/login');
  }

  // If user is authenticated and tries to visit login or register
  if (isAuthRoute) {
    return context.redirect('/');
  }

  return next();
});
