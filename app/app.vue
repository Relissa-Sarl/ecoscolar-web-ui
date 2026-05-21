<script setup lang="ts">
useHead({
  titleTemplate: title => title ? `${title} | EcoScolar` : 'EcoScolar'
})
useSeoMeta({
  title: 'Home',
  description: 'La marketplace e-commerce pour les étudiants (Livres, Matériel, Cours)'
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
