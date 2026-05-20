<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const localePath = useLocalePath()

const usersStore = useUsersStore()
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
          {{ $t('common.cart') }}
        </NuxtLink>

        <!-- Display login link if user is not authenticated -->
        <template
          v-if="!usersStore.isAuthenticated"
        >
          <NuxtLink
            :to="localePath('/login')"
            class="text-gray-700 hover:text-emerald-700 dark:text-gray-300 dark:hover:text-emerald-400 transition-colors"
          >
            {{ $t('common.login') }}
          </NuxtLink>
        </template>
        <!-- Display profile link if user is authenticated -->
        <template
          v-else
        >
          <NuxtLink
            :to="localePath('/profile')"
            class="px-4 py-2 bg-emerald-800 text-white rounded-full hover:bg-emerald-700 transition-colors"
          >
            {{ $t('common.profile') }}
          </NuxtLink>
          <button
            class="flex items-center gap-2 py-2 text-sm font-semibold text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors cursor-pointer"
            @click="usersStore.logout()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.25"
              />
            </svg>
            <span class="hidden sm:inline">{{ $t('common.logout') }}</span>
          </button>
        </template>
      </div>
    </div>
  </header>
</template>
