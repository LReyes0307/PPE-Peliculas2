<script setup lang="ts">
// Carga una película para edición y coordina el formulario CRUD.
import { computed, onMounted, ref } from 'vue'
import Navbar from './Navbar.vue'
import MovieForm from './MovieForm.vue'
import type { Movie } from '../types/movie'

const initialMovie = ref<Movie>()
const isLoading = ref(true)
const loadError = ref('')
const editing = computed(() => initialMovie.value !== undefined)

const loadMovie = async () => {
  const id = new URLSearchParams(window.location.search).get('id')

  if (!id) return
  if (!/^\d+$/.test(id)) {
    loadError.value = 'El identificador de la película no es válido.'
    return
  }

  const res = await fetch(`/api/movies/${id}`)
  if (res.status === 401) {
    window.location.assign('/login')
    return
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'No se pudo cargar la película.')
  }

  const result = await res.json()
  initialMovie.value = result.data
}

onMounted(async () => {
  try {
    await loadMovie()
  } catch (error) {
    loadError.value =
      error instanceof Error
        ? error.message
        : 'No se pudo cargar la película.'
  } finally {
    isLoading.value = false
  }
})

const finishEditing = () => {
  window.location.assign('/')
}
</script>

<template>
  <div>
  <Navbar />
  <main class="editor-page">
  <p v-if="isLoading" role="status">Cargando formulario...</p>

  <section v-else-if="loadError" class="load-error" role="alert">
    <p>{{ loadError }}</p>
    <a href="/">Volver al catálogo</a>
  </section>

  <MovieForm
    v-else
    :initial-movie="initialMovie"
    :editing="editing"
    @submit="finishEditing"
    @cancel="finishEditing"
  />
  </main>
  </div>
</template>

<style scoped>
.editor-page {
  width: min(900px, calc(100% - 40px));
  margin: 48px auto 72px;
}

.load-error {
  padding: 24px;
  border-left: 4px solid #b91c1c;
  background: #fff;
  color: #7f1d1d;
}

.load-error a {
  color: #166534;
  font-weight: 700;
}

@media (max-width: 600px) {
  .editor-page {
    width: calc(100% - 28px);
    margin-top: 28px;
  }
}
</style>