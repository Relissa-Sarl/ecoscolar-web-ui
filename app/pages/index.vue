<script setup lang="ts">
// definePageMeta({ layout: 'admin' })
</script>

<template>
  <section style="padding: 2rem; text-align: center;">
    <h1>{{ $t('home.welcome') }}</h1>

    <p style="margin: 1rem 0; color: #666;">
      [ Ici s'affichera la liste des derniers livres et objets en vente ]
    </p>

    <button style="padding: 0.5rem 1rem;">
      {{ $t('home.cta') }}
    </button>
  </section>
</template>
