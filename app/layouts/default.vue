<script setup lang="ts">
import AppHeader from '~/components/AppHeader.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen bg-white dark:bg-gray-950">
    <AppHeader />
    <main class="flex-1 p-8">
      <slot />
    </main>
    <footer class="p-6 text-center text-sm text-gray-500 border-t border-gray-200 dark:border-gray-800">
      <p>[ Footer : Liens utiles, Mentions légales, Copyright 2026 ]</p>
    </footer>
  </div>
</template>
