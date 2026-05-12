<template>
  <div class="max-w-md mx-auto py-12 px-4">
    <nav class="mb-8" aria-label="Navigation de retour">
      <NuxtLink
        :to="localePath('/')"
        class="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-400 hover:underline font-medium focus:ring-2 focus:ring-emerald-500 outline-none rounded"
      >
        <span aria-hidden="true">←</span> {{ $t('common.back_to_home') }}
      </NuxtLink>
    </nav>

    <header class="mb-8 text-center">
      <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">
        {{ $t('login.title') }}
      </h1>
      <p class="mt-2 text-slate-600 dark:text-slate-400">
        {{ $t('login.subtitle') }}
      </p>
    </header>

    <LoginForm />

    <p class="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
      {{ $t('login.no_account') }}
      <NuxtLink :to="localePath('/register')" class="font-bold text-emerald-800 dark:text-emerald-400 underline ml-1">
        {{ $t('login.register_link') }}
      </NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
</script>
