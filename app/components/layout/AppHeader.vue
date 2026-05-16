<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <header class="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
    <div>
      <NuxtLink
        :to="localePath('/')"
        class="flex items-center gap-2 text-xl font-bold text-emerald-900 dark:text-emerald-100 hover:opacity-80 transition-opacity"
        aria-label="EcoScolar - Retour à l'accueil"
      >
        <svg
          class="w-8 h-8 text-emerald-800 dark:text-emerald-500"
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
        </svg>
        <span>EcoScolar</span>
      </NuxtLink>
    </div>

    <div class="flex items-center gap-6">
      <nav
        class="flex items-center gap-2"
        aria-label="Sélecteur de langue"
      >
        <span
          class="text-sm text-gray-500 dark:text-gray-400"
          aria-hidden="true"
        >Langue :</span>
        <button
          v-for="l in locales"
          :key="l.code"
          class="px-2 py-1 text-sm border rounded cursor-pointer transition-colors focus:ring-2 focus:ring-emerald-500 outline-none"
          :class="locale === l.code
            ? 'font-bold bg-emerald-100 border-emerald-400 text-emerald-900 dark:bg-emerald-900 dark:border-emerald-500 dark:text-emerald-100'
            : 'bg-transparent border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800'"
          :aria-current="locale === l.code ? 'page' : undefined"
          @click="setLocale(l.code)"
        >
          {{ l.code.toUpperCase() }}
        </button>
      </nav>

      <div class="flex items-center gap-4 text-sm font-medium">
        <NuxtLink
          :to="localePath('/favorites')"
          class="text-gray-700 hover:text-emerald-700 dark:text-gray-300 dark:hover:text-emerald-400 transition-colors"
        >
          {{ $t('common.favorites') }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/cart')"
          class="text-gray-700 hover:text-emerald-700 dark:text-gray-300 dark:hover:text-emerald-400 transition-colors"
        >
          Panier (0)
        </NuxtLink>
        <NuxtLink
          :to="localePath('/login')"
          class="text-gray-700 hover:text-emerald-700 dark:text-gray-300 dark:hover:text-emerald-400 transition-colors"
        >
          Connexion
        </NuxtLink>
        <NuxtLink
          :to="localePath('/profile')"
          class="px-4 py-2 bg-emerald-800 text-white rounded-full hover:bg-emerald-700 transition-colors"
        >
          Profil
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
