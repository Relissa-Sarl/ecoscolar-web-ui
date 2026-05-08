<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <header class="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
    <div>
      <NuxtLink
        :to="localePath('/')"
        class="text-xl font-bold text-gray-800 dark:text-white hover:text-indigo-600 transition-colors"
      >
        [ LOGO EcoScolar ]
      </NuxtLink>
    </div>

    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-500 dark:text-gray-400">Langue :</span>
      <button
        v-for="l in locales"
        :key="l.code"
        class="px-2 py-1 text-sm border rounded cursor-pointer transition-colors"
        :class="locale === l.code
          ? 'font-bold bg-gray-200 border-gray-400 dark:bg-gray-700 dark:border-gray-500'
          : 'bg-transparent border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800'"
        @click="setLocale(l.code)">
        {{ l.code.toUpperCase() }}
      </button>
    </div>

    <div class="flex gap-4 text-sm font-medium">
      <NuxtLink
        :to="localePath('/cart')"
        class="text-gray-700 hover:text-indigo-600 dark:text-gray-300"
      >
        [ Panier (0) ]
      </NuxtLink>
      <NuxtLink
        :to="localePath('/login')"
        class="text-gray-700 hover:text-indigo-600 dark:text-gray-300"
      >
        [ Connexion ]
      </NuxtLink>
    </div>
  </header>
</template>
