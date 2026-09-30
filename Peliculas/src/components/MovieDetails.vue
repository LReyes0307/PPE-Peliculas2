<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Movie } from '../types/movie'
import { supabase } from '../lib/supabase'
import { fromPeliculaRow, type PeliculaRow } from '../lib/pelicula'

const movie = ref<Movie>()
const isLoading = ref(true)
const loadError = ref('')

onMounted(async () => {
  try {
    const id = new URLSearchParams(window.location.search).get('id')
    if (!id || !/^\d+$/.test(id)) {
      throw new Error('No se indicó una película válida.')
    }

    const { data, error } = await supabase
      .from('Pelicula')
      .select('*')
      .eq('id', Number(id))
      .single()

    if (error) throw error
    movie.value = fromPeliculaRow(data as PeliculaRow)
  } catch (error) {
    loadError.value =
      error instanceof Error
        ? error.message
        : 'No se pudo cargar la película.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <p v-if="isLoading" role="status">Cargando película...</p>

  <section v-else-if="loadError" class="detail-error" role="alert">
    <p>{{ loadError }}</p>
    <a href="/">Volver al catálogo</a>
  </section>

  <article v-else-if="movie" class="movie-detail">
    <img :src="movie.poster_url" :alt="`Póster de ${movie.titulo}`" />

    <div class="detail-copy">
      <a class="back-link" href="/">← Catálogo</a>
      <p class="genre">{{ movie.genero }} · {{ movie.clasificacion_edad }}</p>
      <h1>{{ movie.titulo }}</h1>
      <p class="rating">{{ movie.calificacion }} / 10</p>
      <p class="synopsis">{{ movie.sinopsis }}</p>

      <dl>
        <div><dt>Director</dt><dd>{{ movie.director }}</dd></div>
        <div><dt>Reparto</dt><dd>{{ movie.reparto }}</dd></div>
        <div><dt>Estreno</dt><dd>{{ movie.fecha_estreno || 'Sin fecha' }}</dd></div>
        <div><dt>Duración</dt><dd>{{ movie.duracion }} min</dd></div>
        <div><dt>Idioma</dt><dd>{{ movie.idioma }}</dd></div>
        <div><dt>País</dt><dd>{{ movie.pais }}</dd></div>
      </dl>

      <a class="edit-link" :href="`/MovieForm?id=${movie.id}`">
        Editar película
      </a>
    </div>
  </article>
</template>

<style scoped>
.movie-detail {
  display: grid;
  grid-template-columns: minmax(220px, 340px) minmax(0, 1fr);
  gap: 40px;
  align-items: start;
}

.movie-detail > img {
  display: block;
  width: 100%;
  max-height: 510px;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  background: #e5e7eb;
}

.detail-copy h1 {
  margin: 8px 0;
  font-size: 36px;
}

.back-link,
.detail-error a {
  color: #166534;
  font-weight: 700;
  text-decoration: none;
}

.genre {
  margin: 28px 0 0;
  color: #64748b;
}

.rating {
  color: #a16207;
  font-weight: 800;
}

.synopsis {
  line-height: 1.7;
}

dl {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin: 28px 0;
}

dl div {
  min-width: 0;
}

dt {
  color: #64748b;
  font-size: 13px;
}

dd {
  margin: 4px 0 0;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.edit-link {
  display: inline-block;
  padding: 11px 16px;
  border-radius: 5px;
  background: #166534;
  color: #fff;
  font-weight: 700;
  text-decoration: none;
}

.detail-error {
  padding: 24px;
  border-left: 4px solid #b91c1c;
  background: #fff;
}

@media (max-width: 680px) {
  .movie-detail {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
  }

  .movie-detail > img {
    width: min(100%, 320px);
  }

  .detail-copy h1 {
    font-size: 30px;
  }
}
</style>