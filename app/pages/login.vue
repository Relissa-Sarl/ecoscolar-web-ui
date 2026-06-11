<script setup lang="ts">
const localePath = useLocalePath()
const usersStore = useUsersStore()

/**
 * Define the page metadata to specify that this page should only
 * be accessible to guests (unauthenticated users) by using the 'guest' middleware.
 */
definePageMeta({
  middleware: 'guest'
})

/**
 * When the component is mounted, clear any existing error messages in
 * the users store to ensure a clean state for the registration form.
 */
onMounted(() => {
  usersStore.clearErrors()
})
</script>

<template>
  <div class="max-w-md mx-auto py-12 px-4">
    <nav
      class="mb-8"
      aria-label="Navigation de retour"
    >
      <NuxtLink
        :to="localePath('/')"
        class="group inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-sm font-medium no-underline focus:ring-2 focus:ring-emerald-500 outline-none rounded"
      >
        <span aria-hidden="true">←</span>
        <span class="border-b border-transparent pb-px group-hover:border-current">{{ $t('common.back_to_home') }}</span>
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

    <AccountLoginForm />

    <p class="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
      {{ $t('login.no_account') }}
      <NuxtLink
        :to="localePath('/register')"
        class="font-bold text-emerald-800 dark:text-emerald-400 underline ml-1"
      >
        {{ $t('login.register_link') }}
      </NuxtLink>
    </p>
  </div>
</template>
