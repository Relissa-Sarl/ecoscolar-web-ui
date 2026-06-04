<script setup lang="ts">
defineOptions({
  name: 'AppErrorPage'
})

type AppError = {
  statusCode?: number
  statusMessage?: string
  message?: string
}

const props = defineProps<{
  error: AppError
}>()

const localePath = useLocalePath()
const { t } = useI18n()

const isNotFound = computed(() => props.error.statusCode === 404)

const pageTitle = computed(() =>
  isNotFound.value ? t('error.not_found.title') : t('error.generic.title')
)

const pageMessage = computed(() =>
  isNotFound.value ? t('error.not_found.message') : t('error.generic.message')
)

const pageCode = computed(() => props.error.statusCode ?? 500)

useSeoMeta({
  title: pageTitle,
  description: pageMessage
})

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-white px-4 py-12 dark:bg-gray-950">
    <section class="w-full max-w-3xl">
      <div class="rounded-3xl border border-red-200 bg-red-50 p-8 shadow-sm dark:border-red-900/50 dark:bg-red-950/40 md:p-10">
        <p class="text-base font-bold uppercase tracking-[0.35em] text-red-800 dark:text-red-300 md:text-lg">
          {{ pageCode }}
        </p>

        <h1 class="mt-4 text-4xl font-bold tracking-tight text-red-950 dark:text-red-50 md:text-5xl">
          {{ pageTitle }}
        </h1>

        <p class="mt-3 max-w-2xl text-base leading-7 text-red-900/90 dark:text-red-100/90 md:text-lg">
          {{ pageMessage }}
        </p>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-xl bg-red-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-red-50 dark:bg-red-500 dark:text-slate-950 dark:hover:bg-red-400 dark:focus:ring-offset-red-950"
            @click="goHome"
          >
            {{ t('error.actions.back_home') }}
          </button>

          <NuxtLink
            :to="localePath('/support')"
            class="inline-flex items-center justify-center rounded-xl border border-red-300 bg-white px-5 py-3 text-sm font-bold text-red-900 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-red-50 dark:border-red-800 dark:bg-slate-900 dark:text-red-200 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-950"
          >
            {{ t('error.actions.contact_support') }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>
