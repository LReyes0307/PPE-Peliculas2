<script setup lang="ts">
import { Film, Plus, LogOut } from '@lucide/vue'
import { onMounted, ref } from 'vue'
import { supabase } from '../lib/supabase'

const showLogoutModal = ref(false)
const routePath = ref('')
const logoutError = ref('')

onMounted(() => {
  routePath.value = window.location.pathname
})

const goToMovies = () => {
  window.location.assign('/')
}

const goToCreateMovie = () => {
  window.location.assign('/MovieForm')
}

const askLogout = () => {
  showLogoutModal.value = true
}

const cancelLogout = () => {
  showLogoutModal.value = false
}

const goToAbout = () => {
  window.location.assign('/about')
}

const goToLogin = () => {
  window.location.assign('/login')
}

const confirmLogout = async () => {
  logoutError.value = ''

  try {
    const { error } = await supabase.auth.signOut()

    if (error) throw error

    showLogoutModal.value = false
    window.location.assign('/login')
  } catch {
    logoutError.value = 'No se pudo cerrar la sesión. Inténtalo de nuevo.'
  }
}
</script>

<template>
  <div class="navbar-root">
    <nav class="navbar">
      <div class="logo" @click="goToMovies">
        <Film :size="24" />
        <span>MovieRadar</span>
      </div>

      <div class="nav-links">
        <button
          :class="{ active: routePath === '/' }"
          @click="goToMovies"
        >
          Películas
        </button>

        <button
          :class="{ active: routePath === '/about' }"
          @click="goToAbout"
        >
          Acerca de
        </button>

        <button
          class="add-button"
          :class="{ active: routePath === '/MovieForm' }"
          @click="goToCreateMovie"
        >
          <Plus :size="18" />
          Agregar película
        </button>

        <button
          class="logout-button"
          @click="askLogout"
        >
          <LogOut :size="18" />
          Salir
        </button>
      </div>
    </nav>

    <div
      v-if="showLogoutModal"
      class="modal-overlay"
      @click.self="cancelLogout"
    >
      <div class="modal">
        <h2>¿Cerrar sesión?</h2>

        <p>
          ¿Está seguro de que desea salir de su cuenta?
        </p>

        <p
          v-if="logoutError"
          role="alert"
        >
          {{ logoutError }}
        </p>

        <div class="modal-actions">
          <button
            class="cancel-modal"
            @click="cancelLogout"
          >
            Cancelar
          </button>

          <button
            class="confirm-modal"
            @click="confirmLogout"
          >
            Sí, salir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.navbar-root {
  display: contents;
}

.navbar {
  width: 100%;
  min-height: 70px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  background: #111827;
  color: #ffffff;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 0.5px;
  cursor: pointer;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-links button {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 14px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: #ffffff;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-links button.active {
  background: #374151;
  border-color: #4b5563;
}

.nav-links button:hover {
  background: #1f2937;
  border-color: #374151;
}

.nav-links .add-button {
  background: transparent;
  color: #ffffff;
}

.nav-links .add-button:hover {
  background: #1f2937;
  border-color: #374151;
}

.nav-links .add-button.active {
  background: #2563eb;
  color: #ffffff;
  border-color: transparent;
}

.nav-links .add-button.active:hover {
  background: #1d4ed8;
  border-color: transparent;
}

.nav-links .logout-button {
  color: #fca5a5;
}

.nav-links .logout-button:hover {
  background: #3f1d1d;
  border-color: #7f1d1d;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.55);
}

.modal {
  width: 100%;
  max-width: 420px;
  padding: 28px;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
}

.modal h2 {
  margin: 0 0 10px;
  color: #111827;
}

.modal p {
  margin: 0 0 25px;
  color: #6b7280;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-modal,
.confirm-modal {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
}

.cancel-modal {
  background: #e5e7eb;
  color: #374151;
}

.cancel-modal:hover {
  background: #d1d5db;
}

.confirm-modal {
  background: #dc2626;
  color: #ffffff;
}

.confirm-modal:hover {
  background: #b91c1c;
}

@media (max-width: 600px) {
  .navbar {
    min-height: auto;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 14px;
  }

  .nav-links {
    flex-wrap: wrap;
    gap: 6px;
  }

  .nav-links button {
    padding: 8px 10px;
    font-size: 14px;
  }
}
</style>