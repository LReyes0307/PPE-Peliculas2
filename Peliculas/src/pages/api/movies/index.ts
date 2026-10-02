import type { APIRoute } from 'astro';
import { fromPeliculaRow, toPeliculaRow, type PeliculaRow } from '../../../lib/pelicula';
import type { Movie } from '../../../types/movie';

// Lista y crea películas; las operaciones requieren una sesión autenticada.
export const GET: APIRoute = async ({ url, locals }) => {
  if (!locals.user) {
    return new Response(
      JSON.stringify({ error: 'No autorizado. Debes iniciar sesión.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));
  const limitParam = url.searchParams.get('limit');
  const fetchAll = url.searchParams.get('all') === 'true';
  const limit = limitParam ? Math.max(1, parseInt(limitParam, 10)) : 6;
  const search = url.searchParams.get('search')?.trim();
  const genre = url.searchParams.get('genre')?.trim();

  try {
    let query = locals.supabase
      .from('Pelicula')
      .select('*', { count: 'exact' })
      .order('title', { ascending: true });

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    if (genre) {
      query = query.ilike('genre', `%${genre}%`);
    }

    if (!fetchAll) {
      const start = (page - 1) * limit;
      const end = start + limit - 1;
      query = query.range(start, end);
    }

    const { data, error, count } = await query;

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const movies: Movie[] = (data ?? []).map((row) =>
      fromPeliculaRow(row as PeliculaRow)
    );

    const total = count ?? movies.length;
    const totalPages = fetchAll ? 1 : Math.ceil(total / limit);

    return new Response(
      JSON.stringify({
        data: movies,
        total,
        page: fetchAll ? 1 : page,
        limit: fetchAll ? total : limit,
        totalPages,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error interno del servidor';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response(
      JSON.stringify({ error: 'No autorizado. Debes iniciar sesión.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();

    // Support both Movie (Spanish keys) and PeliculaRow (English keys)
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

    if (!rowData.title) {
      return new Response(
        JSON.stringify({ error: 'El título de la película es obligatorio.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Assign nextId to avoid sequence permission errors if sequence grant is missing
    const { data: maxRows } = await locals.supabase
      .from('Pelicula')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);
    const nextId = ((maxRows?.[0] as { id: number } | undefined)?.id ?? 0) + 1;
    const insertPayload = { ...rowData, id: nextId };

    const { data, error } = await locals.supabase
      .from('Pelicula')
      .insert([insertPayload])
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
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error al procesar la solicitud.';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
