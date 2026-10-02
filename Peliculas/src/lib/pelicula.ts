import type { Movie } from '../types/movie'

// Adapta los nombres de columnas Supabase al modelo usado por Vue.
export interface PeliculaRow {
  id: number
  title: string
  director: string
  cast: string
  genre: string
  ageRating: string
  releaseDate: string | null
  durationMinutes: number
  synopsis: string
  country: string
  originalLanguage: string
  rating: number
  image: string
}

export const toPeliculaRow = (movie: Omit<Movie, 'id'>) => ({
  title: movie.titulo,
  director: movie.director,
  cast: movie.reparto,
  genre: movie.genero,
  ageRating: movie.clasificacion_edad,
  releaseDate: movie.fecha_estreno || null,
  durationMinutes: movie.duracion,
  synopsis: movie.sinopsis,
  country: movie.pais,
  originalLanguage: movie.idioma,
  rating: movie.calificacion,
  image: movie.poster_url,
})

export const fromPeliculaRow = (row: PeliculaRow): Movie => ({
  id: row.id,
  titulo: row.title,
  director: row.director,
  reparto: row.cast,
  genero: row.genre,
  clasificacion_edad: row.ageRating,
  fecha_estreno: row.releaseDate?.slice(0, 10) ?? '',
  duracion: row.durationMinutes,
  sinopsis: row.synopsis,
  poster_url: row.image,
  calificacion: row.rating,
  idioma: row.originalLanguage,
  pais: row.country,
})