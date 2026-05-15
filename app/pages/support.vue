<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const breadcrumbItems = computed(() => [
  { label: t('common.home'), to: localePath('/') },
  { label: t('support.title') }
])
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <Breadcrumb
      class="mb-8"
      :items="breadcrumbItems"
    />

    <header class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
        {{ $t('support.title') }}
      </h1>
      <p class="mt-2 text-slate-600 dark:text-slate-400">
        {{ $t('support.description') }}
      </p>
    </header>

    <SupportForm />
  </div>
</template>
