import type { APIRoute } from 'astro';

// Cierra la sesión actual de Supabase.
export const POST: APIRoute = async ({ locals }) => {
  if (locals.supabase) {
    try {
      await locals.supabase.auth.signOut();
    } catch {
      // ignore
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
