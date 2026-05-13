<template>
  <div class="max-w-md mx-auto py-12 px-4">
    <nav
      class="mb-8"
      aria-label="Retour"
    >
      <NuxtLink
        :to="localePath('/')"
        class="text-emerald-700 dark:text-emerald-400 hover:underline text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
      >
        ← {{ $t('common.back_to_home') }}
      </NuxtLink>
    </nav>

    <header class="mb-8 text-center">
      <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">
        {{ $t('register.title') }}
      </h1>
      <p class="mt-2 text-slate-600 dark:text-slate-400">
        {{ $t('register.subtitle') }}
      </p>
    </header>

    <RegisterForm />

    <p class="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
      {{ $t('register.has_account') }}
      <NuxtLink
        :to="localePath('/login')"
        class="font-bold text-emerald-800 dark:text-emerald-400 underline ml-1"
      >
        {{ $t('register.login_link') }}
      </NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
</script>
