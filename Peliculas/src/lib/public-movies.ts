import type { SupabaseClient } from '@supabase/supabase-js'
import { fromPeliculaRow, type PeliculaRow } from './pelicula'
import type { Movie } from '../types/movie'

// Consulta en Supabase los resultados SSR con búsqueda y paginación.
const pageSize = 6

export interface PublicMoviePage {
  movies: Movie[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  search: string
  error: string
}

export const getPublicMoviePage = async (
  supabase: SupabaseClient,
  searchParams: URLSearchParams,
): Promise<PublicMoviePage> => {
  const search = searchParams.get('q')?.trim() ?? ''
  const requestedPage = Number.parseInt(searchParams.get('page') ?? '1', 10)
  const safePage = Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1

  let countQuery = supabase
    .from('Pelicula')
    .select('id', { count: 'exact', head: true })
  let movieQuery = supabase
    .from('Pelicula')
    .select('*')
    .order('title', { ascending: true })

  if (search) {
    countQuery = countQuery.ilike('title', `%${search}%`)
    movieQuery = movieQuery.ilike('title', `%${search}%`)
  }

  const { count, error: countError } = await countQuery
  if (countError) {
    return {
      movies: [],
      total: 0,
      page: 1,
      pageSize,
      totalPages: 1,
      search,
      error: countError.message,
    }
  }

  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const page = Math.min(safePage, totalPages)
  const start = (page - 1) * pageSize
  const { data, error } = await movieQuery.range(start, start + pageSize - 1)

  return {
    movies: error
      ? []
      : (data ?? []).map((row) => fromPeliculaRow(row as PeliculaRow)),
    total,
    page,
    pageSize,
    totalPages,
    search,
    error: error?.message ?? '',
  }
}
