<template>
  <div class="max-w-2xl mx-auto">
    <nav class="mb-8" aria-label="Fil d'Ariane">
      <NuxtLink :to="localePath('/')" class="text-emerald-700 hover:underline text-sm font-medium">
        {{ $t('common.back_to_home') }}
      </NuxtLink>
    </nav>

    <header class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
        {{ $t('support.title') }}
      </h1>
      <p class="mt-2 text-slate-600 dark:text-slate-400">
        {{ $t('support.description') }}
      </p>
    </header>

    <SupportForm />
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
</script>
