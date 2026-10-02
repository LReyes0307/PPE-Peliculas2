<script setup lang="ts">
// Renderiza la ruta auxiliar de navegación.
import Navbar from './Navbar.vue'
</script>

<template>
  <div>
    <Navbar />
    <main class="nav-page">
      <a href="/">Ir al catálogo</a>
    </main>
  </div>
</template>

<style scoped>
.nav-page {
  width: min(1180px, calc(100% - 40px));
  margin: 48px auto;
}

.nav-page a {
  color: #166534;
  font-weight: 700;
}
</style>