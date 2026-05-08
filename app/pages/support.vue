<template>
  <div class="max-w-2xl mx-auto">
    <nav class="mb-8" aria-label="Fil d'Ariane">
      <NuxtLink :to="localePath('/')" class="text-emerald-700 hover:underline text-sm font-medium">
        ← Retour à l'accueil
      </NuxtLink>
    </nav>

    <header class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Contactez le support</h1>
      <p class="mt-2 text-slate-600 dark:text-slate-400">
        Une question ou un problème ? Notre équipe EcoScolar vous répond.
      </p>
    </header>

    <SupportForm />
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
</script>
