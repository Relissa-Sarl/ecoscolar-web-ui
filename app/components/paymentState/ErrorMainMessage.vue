<script setup lang="ts">
</script>

<template>
  <div class="space-y-3">
    <h1 class="text-3xl font-black bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent dark:from-red-400 dark:to-rose-300">
      {{ $t('cart.denied.title') }}
    </h1>
    <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed px-2">
      {{ $t('cart.denied.subtitle') }}
    </p>
  </div>
</template>
