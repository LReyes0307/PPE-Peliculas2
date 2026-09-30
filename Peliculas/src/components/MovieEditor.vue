<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import MovieForm from './MovieForm.vue'
import type { Movie } from '../types/movie'
import { supabase } from '../lib/supabase'
import { fromPeliculaRow, type PeliculaRow } from '../lib/pelicula'

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

  const { data, error } = await supabase
    .from('Pelicula')
    .select('*')
    .eq('id', Number(id))
    .single()

  if (error) throw error
  initialMovie.value = fromPeliculaRow(data as PeliculaRow)
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
</template>

<style scoped>
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
</style>