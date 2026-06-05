<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">
    {{ $t('cart.empty.title') }}
  </h2>
  <p class="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
    {{ $t('cart.empty.subtitle') }}
  </p>
  <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
    <NuxtLink
      :to="localePath('/shop')"
      class="px-6 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow transition-all cursor-pointer text-sm"
    >
      {{ $t('cart.empty.go_to_shop') }}
    </NuxtLink>
    <NuxtLink
      :to="localePath('/')"
      class="px-6 py-3 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer text-sm"
    >
      {{ $t('cart.empty.back_to_home') }}
    </NuxtLink>
  </div>
</template>
