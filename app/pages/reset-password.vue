<script setup lang="ts">
definePageMeta({
  middleware: 'guest'
})
</script>

<template>
  <div class="max-w-md mx-auto py-12 px-4">
    <NuxtLink
      to="/login"
      class="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-400 hover:underline font-medium focus:ring-2 focus:ring-emerald-500 outline-none rounded mb-8"
    >
      ← {{ $t('reset_password.return_to_login') }}
    </NuxtLink>

    <div class="mb-8 text-center">
      <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">
        {{ $t('reset_password.title') }}
      </h1>
      <p class="mt-2 text-slate-600 dark:text-slate-400">
        {{ $t('reset_password.subtitle') }}
      </p>
    </div>
    <AccountResetPasswordForm />
  </div>
</template>
