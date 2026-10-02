<script setup lang="ts">
// Renderiza resultados SSR y los enlaces de paginación del catálogo.
import { computed, ref } from 'vue'
import Navbar from './Navbar.vue'
import MovieCard from './MovieCard.vue'
import MovieFilters from './MovieFilters.vue'
import type { Movie } from '../types/movie'

const props = withDefaults(defineProps<{
  movies: Movie[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  search: string
  error: string
  eyebrow?: string
  heading?: string
}>(), {
  movies: () => [],
  total: 0,
  page: 1,
  pageSize: 6,
  totalPages: 1,
  search: '',
  error: '',
  eyebrow: 'BIBLIOTECA',
  heading: 'Películas',
})

const filteredMovies = ref<Movie[]>(props.movies)
const pages = computed(() => Array.from(
  { length: props.totalPages },
  (_, index) => index + 1,
))

const updateMovies = (moviesFiltered: Movie[]) => {
  filteredMovies.value = moviesFiltered
}

const pageUrl = (page: number) => {
  const params = new URLSearchParams()
  if (props.search) params.set('q', props.search)
  params.set('page', String(page))
  return `/?${params.toString()}`
}
</script>

<template>
  <div>
    <Navbar />
    <main class="page-content">
      <header class="page-heading">
        <div>
          <p class="eyebrow">{{ props.eyebrow }}</p>
          <h1>{{ props.heading }}</h1>
        </div>
      </header>

  <div class="catalog-root">
    <MovieFilters
      :movies="props.movies"
      :initial-title="props.search"
      @filter="updateMovies"
    />

    <p
      v-if="props.error"
      class="status-message error-state"
      role="alert"
    >
      {{ props.error }}
    </p>

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
        v-if="props.totalPages > 1"
        class="pagination"
        aria-label="Paginación de películas"
      >
        <a
          class="pagination-button"
          :class="{ disabled: props.page === 1 }"
          :href="pageUrl(Math.max(1, props.page - 1))"
          :aria-disabled="props.page === 1"
        >
          Anterior
        </a>

        <a
          v-for="page in pages"
          :key="page"
          class="pagination-button page-number"
          :class="{ active: props.page === page }"
          :href="pageUrl(page)"
          :aria-current="props.page === page ? 'page' : undefined"
        >
          {{ page }}
        </a>

        <a
          class="pagination-button"
          :class="{ disabled: props.page === props.totalPages }"
          :href="pageUrl(Math.min(props.totalPages, props.page + 1))"
          :aria-disabled="props.page === props.totalPages"
        >
          Siguiente
        </a>
      </nav>
    </template>
  </div>
    </main>
  </div>
</template>

<style scoped>
.page-content {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
  padding: 48px 0 72px;
}

.page-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 30px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #c2410c;
  font-size: 12px;
  font-weight: 800;
}

h1 {
  margin: 0;
  font-size: 34px;
}

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
  text-decoration: none;
  text-align: center;
}

.pagination-button:hover:not(:disabled) {
  background: #f3f4f6;
}

.pagination-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.pagination-button.active {
  border-color: #2563eb;
  background: #2563eb;
  color: #ffffff;
}

.page-number {
  min-width: 40px;
}

@media (max-width: 560px) {
  .page-content {
    width: min(100% - 28px, 1180px);
    padding-top: 32px;
  }

  .page-heading {
    align-items: start;
    flex-direction: column;
  }
}
</style>