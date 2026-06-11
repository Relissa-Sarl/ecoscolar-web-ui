<script setup lang="ts">
const localePath = useLocalePath()
const route = useRoute()

const shouldShowBackToProfile = computed(() => route.query.from === 'profile')
</script>

<template>
  <nav
    v-if="shouldShowBackToProfile"
    class="mb-6"
    aria-label="Navigation de retour au profil"
  >
    <NuxtLink
      :to="localePath('/me/profile')"
      class="group inline-flex items-center gap-2 rounded text-sm font-medium text-emerald-700 no-underline outline-none transition-colors hover:text-emerald-800 focus:ring-2 focus:ring-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
    >
      <span aria-hidden="true">←</span>
      <span class="border-b border-transparent pb-px group-hover:border-current">
        {{ $t('common.back_to_profile') }}
      </span>
    </NuxtLink>
  </nav>
</template>
