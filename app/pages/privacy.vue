<script setup lang="ts">
import { computed } from 'vue'
import { useI18n, useLocalePath } from '#imports'

const { t, locale } = useI18n()
const localePath = useLocalePath()

const breadcrumbItems = computed(() => [
  { label: t('common.home'), to: localePath('/') },
  { label: t('privacy.title') }
])

const lastUpdatedDate = new Date(Date.UTC(2026, 4, 21)) // Note: months are 0-indexed in JavaScript

// Formate la date manuellement en utilisant l'API Intl
const formattedDate = computed(() => {
  return new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  }).format(lastUpdatedDate)
})
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <Breadcrumb
      class="mb-8"
      :items="breadcrumbItems"
    />

    <article class="prose prose-slate dark:prose-invert max-w-none">
      <header class="mb-10 border-b border-gray-200 dark:border-gray-800 pb-6">
        <h1 class="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {{ $t('privacy.title') }}
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-4">
          {{ $t('common.last_updated') }} <time datetime="2026-05-21">{{ formattedDate }}</time>
        </p>
      </header>

      <section class="space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed">
        <section aria-labelledby="privacy-1-title">
          <h2
            id="privacy-1-title"
            class="text-2xl font-bold text-slate-900 dark:text-white"
          >
            {{ $t('privacy.s1_title') }}
          </h2>
          <p class="mt-4">
            {{ $t('privacy.s1_text') }}
          </p>
        </section>

        <section aria-labelledby="privacy-2-title">
          <h2
            id="privacy-2-title"
            class="text-2xl font-bold text-slate-900 dark:text-white"
          >
            {{ $t('privacy.s2_title') }}
          </h2>
          <p class="mt-4">
            {{ $t('privacy.s2_text') }}
          </p>
          <ul class="list-disc pl-5 space-y-2 mt-4">
            <li
              v-for="(item, index) in $tm('privacy.s2_list')"
              :key="index"
            >
              {{ $rt(item) }}
            </li>
          </ul>
        </section>

        <section aria-labelledby="privacy-3-title">
          <h2
            id="privacy-3-title"
            class="text-2xl font-bold text-slate-900 dark:text-white"
          >
            {{ $t('privacy.s3_title') }}
          </h2>
          <p class="mt-4">
            {{ $t('privacy.s3_text') }}
          </p>
        </section>

        <section aria-labelledby="privacy-4-title">
          <h2
            id="privacy-4-title"
            class="text-2xl font-bold text-slate-900 dark:text-white"
          >
            {{ $t('privacy.s4_title') }}
          </h2>
          <p class="mt-4">
            {{ $t('privacy.s4_text') }}
          </p>
        </section>
      </section>

      <footer class="mt-12 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <p class="text-sm">
          {{ $t('privacy.footer') }}
          <NuxtLink
            :to="localePath('/support')"
            class="text-emerald-700 dark:text-emerald-400 font-bold underline focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            {{ $t('common.contact_support') }}
          </NuxtLink>.
        </p>
      </footer>
    </article>
  </div>
</template>
