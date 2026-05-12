<template>
  <form @submit.prevent="handleLogin" class="space-y-6 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">

    <div class="flex flex-col gap-2">
      <label for="login-email" class="text-sm font-bold text-slate-700 dark:text-slate-300">
        {{ $t('login.email_label') }} <span class="text-red-600" aria-hidden="true">*</span>
      </label>
      <input
        id="login-email"
        v-model="email"
        type="email"
        autocomplete="email"
        required
        aria-required="true"
        :placeholder="$t('login.email_placeholder')"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
      />
    </div>

    <div class="flex flex-col gap-2">
      <div class="flex justify-between items-center">
        <label for="login-password" class="text-sm font-bold text-slate-700 dark:text-slate-300">
          {{ $t('login.password_label') }} <span class="text-red-600" aria-hidden="true">*</span>
        </label>
        <NuxtLink
          :to="localePath('/forgot-password')"
          class="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline focus:ring-2 focus:ring-emerald-500 outline-none rounded"
        >
          {{ $t('login.forgot_password') }}
        </NuxtLink>
      </div>
      <input
        id="login-password"
        v-model="password"
        type="password"
        autocomplete="current-password"
        required
        aria-required="true"
        placeholder="••••••••"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
      />
    </div>

    <button
      type="submit"
      class="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors focus:ring-4 focus:ring-emerald-500/50 outline-none"
    >
      {{ $t('login.submit_button') }}
    </button>

  </form>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const email = ref('')
const password = ref('')

const handleLogin = () => {
  // Logique de connexion à venir
  console.log('Tentative de connexion:', email.value)
}
</script>
