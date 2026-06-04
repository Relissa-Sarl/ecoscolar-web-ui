<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const usersStore = useUsersStore()

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
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
            {{ $t('support.title') }}
          </h1>
          <p class="mt-2 text-slate-600 dark:text-slate-400">
            {{ $t('support.description') }}
          </p>
        </div>
        <NuxtLink
          v-if="usersStore.isAuthenticated"
          :to="localePath('/me/support-requests')"
          class="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
        >
          {{ $t('support.actions.view_requests') }}
        </NuxtLink>
      </div>
    </header>

    <SupportForm />
  </div>
</template>
