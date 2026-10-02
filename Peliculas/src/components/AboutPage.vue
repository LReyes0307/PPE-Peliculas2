<script setup lang="ts">
// Presenta la información estática de Acerca de.
import Navbar from './Navbar.vue'
</script>

<template>
  <div>
    <Navbar />
    <main class="about-page">
      <section class="about-content">
        <h1>Acerca de MovieRadar</h1>

        <p class="intro">
          MovieRadar es una plataforma web creada para consultar y explorar
          películas de una manera sencilla y organizada.
        </p>

        <div class="about-section">
          <h2>¿Qué es MovieRadar?</h2>
          <p>
            La plataforma permite visualizar información de diferentes
            películas, consultar sus características y utilizar filtros
            para encontrar contenido según las preferencias del usuario.
          </p>
        </div>

        <div class="about-section">
          <h2>Objetivo</h2>
          <p>
            El objetivo de MovieRadar es facilitar la búsqueda y consulta
            de películas mediante una interfaz sencilla e intuitiva.
          </p>
        </div>

        <div class="about-section">
          <h2>Tecnologías</h2>
          <p>
            El proyecto utiliza Astro y Vue para el desarrollo de la
            interfaz, junto con Supabase para la gestión de los datos y
            la autenticación.
          </p>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.about-page {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 50px 24px;
}

.about-content {
  max-width: 850px;
  margin: 0 auto;
  padding: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

h1 {
  margin: 0 0 20px;
  color: #111827;
  font-size: 32px;
}

.intro {
  margin-bottom: 35px;
  color: #4b5563;
  font-size: 17px;
  line-height: 1.7;
}

.about-section {
  margin-top: 30px;
}

h2 {
  margin-bottom: 10px;
  color: #111827;
  font-size: 21px;
}

.about-section p {
  margin: 0;
  color: #59636e;
  line-height: 1.7;
}

@media (max-width: 600px) {
  .about-page {
    padding: 30px 16px;
  }

  .about-content {
    padding: 25px;
  }

  h1 {
    font-size: 26px;
  }
}
</style>