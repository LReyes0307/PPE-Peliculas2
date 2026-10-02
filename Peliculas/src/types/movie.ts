// Forma de película compartida por el catálogo, los filtros y el CRUD.
export interface Movie {
  id: number
  titulo: string
  director: string
  reparto: string
  genero: string
  clasificacion_edad: string
  fecha_estreno: string
  duracion: number
  sinopsis: string
  poster_url: string
  calificacion: number
  idioma: string
  pais: string
}