<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const breadcrumbItems = computed(() => [
  { label: t('common.home'), to: localePath('/') },
  { label: t('terms.title') }
])
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
          {{ $t('terms.title') }}
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-4">
          {{ $t('common.last_updated') }} <time datetime="2024-05-20">20 Mai 2024</time>
        </p>
      </header>

      <section class="space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed">
        <section aria-labelledby="section-1-title">
          <h2
            id="section-1-title"
            class="text-2xl font-bold text-slate-900 dark:text-white"
          >
            {{ $t('terms.s1_title') }}
          </h2>
          <p class="mt-4">
            {{ $t('terms.s1_text') }}
          </p>
        </section>

        <section aria-labelledby="section-2-title">
          <h2
            id="section-2-title"
            class="text-2xl font-bold text-slate-900 dark:text-white"
          >
            {{ $t('terms.s2_title') }}
          </h2>
          <p class="mt-4">
            {{ $t('terms.s2_text') }}
          </p>
          <ul class="list-disc pl-5 space-y-2 mt-4">
            <li
              v-for="(item, index) in $tm('terms.s2_list')"
              :key="index"
            >
              {{ $rt(item) }}
            </li>
          </ul>
        </section>

        <section aria-labelledby="section-3-title">
          <h2
            id="section-3-title"
            class="text-2xl font-bold text-slate-900 dark:text-white"
          >
            {{ $t('terms.s3_title') }}
          </h2>
          <p class="mt-4">
            {{ $t('terms.s3_text') }}
          </p>
        </section>
      </section>

      <footer class="mt-12 p-6 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900">
        <p class="text-sm text-emerald-900 dark:text-emerald-300">
          {{ $t('terms.footer') }}
          <NuxtLink
            :to="localePath('/support')"
            class="font-bold underline ml-1 focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            {{ $t('common.contact_support') }}
          </NuxtLink>.
        </p>
      </footer>
    </article>
  </div>
</template>
