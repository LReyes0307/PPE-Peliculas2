<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MovieCard from './MovieCard.vue'
import MovieFilters from './MovieFilters.vue'
import type { Movie } from '../types/movie'
import { supabase } from '../lib/supabase'
import { fromPeliculaRow, type PeliculaRow } from '../lib/pelicula'

const movies = ref<Movie[]>([])
const visibleMovies = ref<Movie[]>([])
const isLoading = ref(true)
const loadError = ref('')

const loadMovies = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    const { data, error } = await supabase
      .from('Pelicula')
      .select('*')
      .order('title', { ascending: true })

    if (error) throw error

    movies.value = (data ?? []).map((row) =>
      fromPeliculaRow(row as PeliculaRow),
    )
    visibleMovies.value = movies.value
  } catch (error) {
    loadError.value =
      error instanceof Error
        ? error.message
        : 'No se pudieron cargar las películas.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadMovies)
</script>

<template>
  <div class="catalog-root">
    <MovieFilters :movies="movies" @filter="visibleMovies = $event" />

    <p v-if="isLoading" class="status-message" role="status">
      Cargando películas...
    </p>

    <section v-else-if="loadError" class="status-message error-state" role="alert">
      <p>{{ loadError }}</p>
      <button type="button" @click="loadMovies">Reintentar</button>
    </section>

    <p v-else-if="movies.length === 0" class="status-message">
      Aún no hay películas en la colección.
    </p>

    <p v-else-if="visibleMovies.length === 0" class="status-message">
      No hay películas que coincidan con esos filtros.
    </p>

    <section v-else class="movies-grid" aria-label="Películas">
      <MovieCard
        v-for="movie in visibleMovies"
        :key="movie.id"
        :movie="movie"
      />
    </section>
  </div>
</template>

<style scoped>
.catalog-root {
  width: 100%;
}

.status-message {
  padding: 28px 0;
  color: #59636e;
}

.error-state {
  color: #991b1b;
}

.error-state button {
  padding: 9px 14px;
  border: 0;
  border-radius: 5px;
  background: #166534;
  color: white;
  cursor: pointer;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  justify-items: center;
  gap: 24px;
  margin-top: 28px;
}
</style>