<script setup lang="ts">
// On récupère "locales" en plus de "locale" et "setLocale"
const { locale, locales, setLocale } = useI18n()
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh] gap-8 px-4">

    <h1 class="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white">
      {{ $t('home.welcome') }}
    </h1>

    <UButton size="xl" color="primary" icon="i-heroicons-shopping-bag">
      {{ $t('home.cta') }}
    </UButton>

    <UDivider class="w-1/3 my-4" />

    <div class="flex gap-4">
      <UButton
        v-for="l in locales"
        :key="l.code"
        :variant="locale === l.code ? 'solid' : 'soft'"
        color="neutral"
        @click="setLocale(l.code)"
      >
        {{ l.code.toUpperCase() }}
      </UButton>
    </div>

  </div>
</template>
