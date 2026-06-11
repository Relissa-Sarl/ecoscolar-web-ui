<script setup lang="ts">
const localePath = useLocalePath()

definePageMeta({
  middleware: 'guest'
})
</script>

<template>
  <div class="max-w-md mx-auto py-12 px-4">
    <nav
      class="mb-8"
      aria-label="Retour"
    >
      <NuxtLink
        :to="localePath('/login')"
        class="group inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-sm font-medium no-underline focus:ring-2 focus:ring-emerald-500 outline-none"
      >
        <span aria-hidden="true">←</span>
        <span class="border-b border-transparent pb-px group-hover:border-current">{{ $t('forgot_password.back_to_login') }}</span>
      </NuxtLink>
    </nav>

    <header class="mb-8 text-center">
      <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">
        {{ $t('login.forgot_password') }}
      </h1>
    </header>

    <AccountForgotPasswordForm />
  </div>
</template>
