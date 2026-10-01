<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Movie } from '../types/movie'
import { supabase } from '../lib/supabase'
import { fromPeliculaRow, type PeliculaRow } from '../lib/pelicula'

const movie = ref<Movie>()
const isLoading = ref(true)
const loadError = ref('')
const showDeleteModal = ref(false)
const isDeleting = ref(false)
const deleteError = ref('')

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

const askDelete = () => {
  deleteError.value = ''
  showDeleteModal.value = true
}

const cancelDelete = () => {
  if (isDeleting.value) return

  showDeleteModal.value = false
}

const confirmDelete = async () => {
  if (!movie.value) return

  try {
    isDeleting.value = true
    deleteError.value = ''

    const { error } = await supabase
      .from('Pelicula')
      .delete()
      .eq('id', movie.value.id)

    if (error) {
      throw error
    }

    showDeleteModal.value = false

    window.location.assign('/')
  } catch (error) {
    console.error(error)

    deleteError.value =
      error instanceof Error
        ? error.message
        : 'No fue posible eliminar la película.'
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <p v-if="isLoading" role="status">
    Cargando película...
  </p>

  <section
    v-else-if="loadError"
    class="detail-error"
    role="alert"
  >
    <p>{{ loadError }}</p>
    <a href="/">Volver al catálogo</a>
  </section>

  <article
    v-else-if="movie"
    class="movie-detail"
  >
    <img
      :src="movie.poster_url"
      :alt="`Póster de ${movie.titulo}`"
    />

    <div class="detail-copy">
      <a class="back-link" href="/">
        ← Catálogo
      </a>

      <p class="genre">
        {{ movie.genero }} · {{ movie.clasificacion_edad }}
      </p>

      <h1>{{ movie.titulo }}</h1>

      <p class="rating">
        {{ movie.calificacion }} / 10
      </p>

      <p class="synopsis">
        {{ movie.sinopsis }}
      </p>

      <dl>
        <div>
          <dt>Director</dt>
          <dd>{{ movie.director }}</dd>
        </div>

        <div>
          <dt>Reparto</dt>
          <dd>{{ movie.reparto }}</dd>
        </div>

        <div>
          <dt>Estreno</dt>
          <dd>{{ movie.fecha_estreno || 'Sin fecha' }}</dd>
        </div>

        <div>
          <dt>Duración</dt>
          <dd>{{ movie.duracion }} min</dd>
        </div>

        <div>
          <dt>Idioma</dt>
          <dd>{{ movie.idioma }}</dd>
        </div>

        <div>
          <dt>País</dt>
          <dd>{{ movie.pais }}</dd>
        </div>
      </dl>

      <div class="actions">
        <a
          class="edit-link"
          :href="`/MovieForm?id=${movie.id}`"
        >
          ✏️ Editar película
        </a>

        <button
          class="delete-button"
          @click="askDelete"
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  </article>

  <div
    v-if="showDeleteModal"
    class="modal-overlay"
    @click.self="cancelDelete"
  >
    <div class="modal">
      <div class="modal-icon">
        🗑️
      </div>

      <h2>¿Eliminar película?</h2>

      <p>
        ¿Está seguro de que desea eliminar
        <strong>{{ movie?.titulo }}</strong>?
      </p>

      <p class="warning">
        Esta acción no se puede deshacer.
      </p>

      <p
        v-if="deleteError"
        class="delete-error"
        role="alert"
      >
        {{ deleteError }}
      </p>

      <div class="modal-actions">
        <button
          class="cancel-modal"
          :disabled="isDeleting"
          @click="cancelDelete"
        >
          Cancelar
        </button>

        <button
          class="confirm-delete-modal"
          :disabled="isDeleting"
          @click="confirmDelete"
        >
          🗑️
          {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
        </button>
      </div>
    </div>
  </div>
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

.actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  align-items: center;
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

.delete-button {
  padding: 11px 16px;
  border: none;
  border-radius: 5px;
  background: #dc2626;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.delete-button:hover {
  background: #b91c1c;
}

.detail-error {
  padding: 24px;
  border-left: 4px solid #b91c1c;
  background: #fff;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(17, 24, 39, 0.55);
}

.modal {
  width: 100%;
  max-width: 430px;
  padding: 30px;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.modal-icon {
  width: 58px;
  height: 58px;
  margin: 0 auto 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fee2e2;
  font-size: 26px;
}

.modal h2 {
  margin: 0 0 10px;
  color: #111827;
  font-size: 23px;
  font-weight: 800;
}

.modal p {
  margin: 0;
  color: #6b7280;
  font-size: 15px;
  line-height: 1.6;
}

.modal p strong {
  color: #374151;
}

.warning {
  margin-top: 8px !important;
  color: #dc2626 !important;
  font-weight: 600;
}

.delete-error {
  margin-top: 15px !important;
  color: #dc2626 !important;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
}

.cancel-modal,
.confirm-delete-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 11px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease;
}

.cancel-modal {
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
}

.cancel-modal:hover:not(:disabled) {
  background: #f3f4f6;
}

.confirm-delete-modal {
  border: none;
  background: #dc2626;
  color: #ffffff;
}

.confirm-delete-modal:hover:not(:disabled) {
  background: #b91c1c;
}

.cancel-modal:disabled,
.confirm-delete-modal:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

  .actions {
    flex-direction: column;
    align-items: stretch;
  }

  .edit-link,
  .delete-button {
    text-align: center;
  }
}

@media (max-width: 500px) {
  .modal {
    padding: 25px;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .cancel-modal,
  .confirm-delete-modal {
    width: 100%;
  }
}
</style>