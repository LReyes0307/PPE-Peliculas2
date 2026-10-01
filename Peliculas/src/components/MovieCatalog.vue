<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import MovieCard from './MovieCard.vue'
import MovieFilters from './MovieFilters.vue'
import type { Movie } from '../types/movie'
import { supabase } from '../lib/supabase'
import { fromPeliculaRow, type PeliculaRow } from '../lib/pelicula'

const movies = ref<Movie[]>([])
const filteredMovies = ref<Movie[]>([])
const isLoading = ref(true)
const loadError = ref('')
const currentPage = ref(1)
const totalMovies = ref(0)
const moviesPerPage = 6

const loadMovies = async (page = 1) => {
  isLoading.value = true
  loadError.value = ''

  try {
    const start = (page - 1) * moviesPerPage
    const end = start + moviesPerPage - 1

    const { data, error, count } = await supabase
      .from('Pelicula')
      .select('*', { count: 'exact' })
      .order('title', { ascending: true })
      .range(start, end)

    if (error) throw error

    movies.value = (data ?? []).map((row) =>
      fromPeliculaRow(row as PeliculaRow),
    )

    filteredMovies.value = movies.value

    totalMovies.value = count ?? 0
    currentPage.value = page
  } catch (error) {
    loadError.value =
      error instanceof Error
        ? error.message
        : 'No se pudieron cargar las películas.'
  } finally {
    isLoading.value = false
  }
}

const totalPages = computed(() => {
  return Math.ceil(totalMovies.value / moviesPerPage)
})

const pages = computed(() => {
  return Array.from(
    { length: totalPages.value },
    (_, index) => index + 1,
  )
})

const updateMovies = (moviesFiltered: Movie[]) => {
  filteredMovies.value = moviesFiltered
}

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  loadMovies(page)
}

const previousPage = () => {
  if (currentPage.value > 1) {
    loadMovies(currentPage.value - 1)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    loadMovies(currentPage.value + 1)
  }
}

onMounted(() => {
  loadMovies()
})
</script>

<template>
  <div class="catalog-root">
    <MovieFilters
      :movies="movies"
      @filter="updateMovies"
    />

    <p
      v-if="isLoading"
      class="status-message"
      role="status"
    >
      Cargando películas...
    </p>

    <section
      v-else-if="loadError"
      class="status-message error-state"
      role="alert"
    >
      <p>{{ loadError }}</p>

      <button
        type="button"
        @click="loadMovies(currentPage)"
      >
        Reintentar
      </button>
    </section>

    <p
      v-else-if="filteredMovies.length === 0"
      class="status-message"
    >
      No se encontraron películas con los filtros seleccionados.
    </p>

    <template v-else>
      <section
        class="movies-grid"
        aria-label="Películas"
      >
        <MovieCard
          v-for="movie in filteredMovies"
          :key="movie.id"
          :movie="movie"
        />
      </section>

      <nav
        v-if="totalPages > 1"
        class="pagination"
        aria-label="Paginación de películas"
      >
        <button
          class="pagination-button"
          :disabled="currentPage === 1"
          @click="previousPage"
        >
          Anterior
        </button>

        <button
          v-for="page in pages"
          :key="page"
          class="pagination-button page-number"
          :class="{ active: currentPage === page }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>

        <button
          class="pagination-button"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          Siguiente
        </button>
      </nav>
    </template>
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 35px;
  margin-bottom: 20px;
}

.pagination-button {
  min-width: 42px;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-button:hover:not(:disabled) {
  background: #f3f4f6;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-button.active {
  border-color: #2563eb;
  background: #2563eb;
  color: #ffffff;
}

.page-number {
  min-width: 40px;
}
</style>