import type { APIRoute } from 'astro';

// Devuelve los datos mínimos de la sesión autenticada.
export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user) {
    return new Response(
      JSON.stringify({ error: 'No autorizado. Debes iniciar sesión.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({
      user: {
        id: locals.user.id,
        email: locals.user.email,
        createdAt: locals.user.created_at,
      },
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
