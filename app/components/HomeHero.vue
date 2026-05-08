<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <section class="py-12 px-4 max-w-7xl mx-auto" aria-labelledby="hero-heading">
    <div class="mb-10">
      <h1 id="hero-heading" class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
        {{ $t('home.welcome') }}
      </h1>
      <p class="mt-2 text-lg text-slate-700 dark:text-slate-300">
        {{ $t('home.subtitle') }}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <article class="group relative overflow-hidden rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 p-8 border border-emerald-200 dark:border-emerald-800 focus-within:ring-2 focus-within:ring-emerald-600">
        <div class="relative z-10 flex flex-col h-full">
          <h2 class="text-2xl font-bold text-emerald-950 dark:text-emerald-50">{{ $t('home.buy_title') }}</h2>
          <p class="mt-2 text-emerald-900/90 dark:text-emerald-100/90">{{ $t('home.buy_text') }}</p>
          <NuxtLink :to="localePath('/shop')" class="mt-6 inline-flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300 underline decoration-2 underline-offset-4 hover:no-underline focus:outline-none">
            {{ $t('home.buy_cta') }} <span aria-hidden="true">→</span>
          </NuxtLink>
        </div>
      </article>

      <article class="group relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-black p-8 focus-within:ring-2 focus-within:ring-emerald-500">
        <div class="relative z-10 flex flex-col h-full">
          <h2 class="text-2xl font-bold text-white">{{ $t('home.sell_title') }}</h2>
          <p class="mt-2 text-slate-200">{{ $t('home.sell_text') }}</p>
          <NuxtLink :to="localePath('/sell')" class="mt-6 inline-flex items-center gap-2 font-bold text-emerald-400 underline decoration-2 underline-offset-4 hover:no-underline focus:outline-none">
            {{ $t('home.sell_cta') }} <span aria-hidden="true">→</span>
          </NuxtLink>
        </div>
      </article>

      <article class="group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-900 p-8 border border-gray-200 dark:border-gray-800">
        <div class="relative z-10">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white">{{ $t('home.impact_title') }}</h2>
          <p class="mt-2 text-slate-700 dark:text-slate-300">{{ $t('home.impact_text') }}</p>
          <div class="mt-6 flex items-center gap-2" role="status" aria-live="polite">
            <span class="text-3xl font-bold text-emerald-700 dark:text-emerald-500">-12kg</span>
            <span class="text-xs text-slate-600 dark:text-slate-400 uppercase font-bold tracking-wider leading-tight">
              CO2<br>{{ $t('home.impact_unit') }}
            </span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
