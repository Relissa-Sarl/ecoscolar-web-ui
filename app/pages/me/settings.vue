<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div class="max-w-2xl mx-auto py-12 px-4">
    <ProfileBackLink />

    <header class="mb-8 text-center">
      <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">
        {{ $t('profile.settings.title') }}
      </h1>
      <p class="mt-2 text-slate-600 dark:text-slate-400">
        {{ $t('profile.settings.subtitle') }}
      </p>
    </header>

    <AccountProfileForm :traduction-base-path="'profile.settings'" />
  </div>
</template>
