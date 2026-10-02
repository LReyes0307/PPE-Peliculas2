import type { APIRoute } from 'astro';
import { fromPeliculaRow, toPeliculaRow, type PeliculaRow } from '../../../lib/pelicula';
import type { Movie } from '../../../types/movie';

// Lee, actualiza y elimina una película por id con sesión autenticada.
export const GET: APIRoute = async ({ params, locals }) => {
  if (!locals.user) {
    return new Response(
      JSON.stringify({ error: 'No autorizado. Debes iniciar sesión.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { id } = params;
  if (!id || !/^\d+$/.test(id)) {
    return new Response(
      JSON.stringify({ error: 'Identificador de película inválido.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { data, error } = await locals.supabase
      .from('Pelicula')
      .select('*')
      .eq('id', Number(id))
      .single();

    if (error || !data) {
      return new Response(
        JSON.stringify({ error: 'Película no encontrada.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const movie = fromPeliculaRow(data as PeliculaRow);
    return new Response(JSON.stringify({ data: movie }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error interno del servidor';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PUT: APIRoute = async ({ params, request, locals }) => {
  if (!locals.user) {
    return new Response(
      JSON.stringify({ error: 'No autorizado. Debes iniciar sesión.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { id } = params;
  if (!id || !/^\d+$/.test(id)) {
    return new Response(
      JSON.stringify({ error: 'Identificador de película inválido.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();

    const rowData =
      body.titulo !== undefined
        ? toPeliculaRow(body as Omit<Movie, 'id'>)
        : {
            title: body.title,
            director: body.director,
            cast: body.cast,
            genre: body.genre,
            ageRating: body.ageRating,
            releaseDate: body.releaseDate || null,
            durationMinutes: body.durationMinutes,
            synopsis: body.synopsis,
            country: body.country,
            originalLanguage: body.originalLanguage,
            rating: body.rating,
            image: body.image,
          };

    const { data, error } = await locals.supabase
      .from('Pelicula')
      .update(rowData)
      .eq('id', Number(id))
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const movie = fromPeliculaRow(data as PeliculaRow);
    return new Response(JSON.stringify({ data: movie }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error al actualizar la película';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  if (!locals.user) {
    return new Response(
      JSON.stringify({ error: 'No autorizado. Debes iniciar sesión.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { id } = params;
  if (!id || !/^\d+$/.test(id)) {
    return new Response(
      JSON.stringify({ error: 'Identificador de película inválido.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { error } = await locals.supabase
      .from('Pelicula')
      .delete()
      .eq('id', Number(id));

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Película eliminada correctamente.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error al eliminar la película';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
