<script setup lang="ts">
import FormErrors from '../common/FormErrors.vue'

const localePath = useLocalePath()
const usersStore = useUsersStore()

// Initialize the login form with empty email and password fields
const loginForm = ref({ email: '', password: '' })

/**
 * Handle the login form submission by calling the login method of the users store with the email and password from the form.
 */
const handleLogin = async () => {
  await usersStore.login(loginForm.value.email, loginForm.value.password)
}

const { globalErrors, hasErrors } = useFormErrors(() => usersStore.errors, 'login.errors')
</script>

<template>
  <form
    class="space-y-6 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"
    @submit.prevent="handleLogin"
  >
    <div class="flex flex-col gap-2">
      <label
        for="login-email"
        class="text-sm font-bold text-slate-700 dark:text-slate-300"
      >
        {{ $t('login.email_label') }} <span
          class="text-red-600"
          aria-hidden="true"
        >*</span>
      </label>
      <input
        id="login-email"
        v-model="loginForm.email"
        type="email"
        autocomplete="email"
        required
        aria-required="true"
        :placeholder="$t('login.email_placeholder')"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
      >
    </div>

    <div class="flex flex-col gap-2">
      <div class="flex justify-between items-center">
        <label
          for="login-password"
          class="text-sm font-bold text-slate-700 dark:text-slate-300"
        >
          {{ $t('login.password_label') }} <span
            class="text-red-600"
            aria-hidden="true"
          >*</span>
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
        v-model="loginForm.password"
        type="password"
        autocomplete="current-password"
        required
        aria-required="true"
        placeholder="••••••••"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
      >
    </div>

    <button
      type="submit"
      class="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors focus:ring-4 focus:ring-emerald-500/50 outline-none"
    >
      {{ $t('login.submit_button') }}
    </button>

    <p
      v-if="usersStore.isLoading"
      class="mt-4 text-sm text-center text-slate-600 dark:text-slate-300"
    >
      {{ $t('login.status.loading') }}
    </p>

    <FormErrors
      :errors="globalErrors"
      :has-errors="hasErrors"
    />
  </form>
</template>
