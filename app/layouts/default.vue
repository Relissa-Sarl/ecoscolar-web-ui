<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <div class="flex flex-col min-h-screen bg-white dark:bg-gray-950">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-emerald-600 focus:text-white"
    >
      Passer au contenu principal
    </a>

    <LayoutAppHeader />

    <main
      id="main-content"
      class="flex-1 p-8"
    >
      <slot />
    </main>

    <footer
      class="p-8 border-t border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
      role="contentinfo"
    >
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <svg
              class="w-6 h-6 text-emerald-800 dark:text-emerald-500"
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
            </svg>
            <span class="text-xl font-bold text-emerald-900 dark:text-emerald-100">EcoScolar</span>
          </div>
          <p class="text-sm text-slate-700 dark:text-slate-300">
            © 2024 EcoScolar. Built for the modern student.
          </p>
        </div>

        <nav aria-label="Navigation secondaire de bas de page">
          <ul class="flex flex-wrap gap-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <li>
              <NuxtLink
                :to="localePath('/support')"
                class="hover:underline focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                Support
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="localePath('/terms')"
                class="hover:underline focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                Terms of Service
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="localePath('/privacy')"
                class="hover:underline focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                Privacy
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  </div>
</template>
