<template>
  <div class="max-w-2xl mx-auto py-12 px-4">
    <header class="mb-8 text-center">
      <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">
        {{ $t('register.profile.title') }}
      </h1>
      <p class="mt-2 text-slate-600 dark:text-slate-400">
        {{ $t('register.profile.subtitle') }}
      </p>
    </header>

    <AccountProfileForm />
  </div>
</template>
