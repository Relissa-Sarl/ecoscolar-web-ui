<script setup lang="ts">
const usersStore = useUsersStore()

definePageMeta({
  middleware: 'auth'
})

// Initialize the registration form with empty email and password fields
const registerForm = ref({ email: '', password: '' })

/**
 * Handle the registration form submission by calling the register
 * method of the users store with the email and password from the form.
 */
const handleRegister = async () => {
  await usersStore.register(registerForm.value.email, registerForm.value.password)
}
</script>

<template>
  <form
    class="space-y-6 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"
    @submit.prevent="handleRegister"
  >
    <div class="flex flex-col gap-2">
      <label
        for="reg-email"
        class="text-sm font-bold text-slate-700 dark:text-slate-300"
      >
        {{ $t('register.email_label') }} <span
          class="text-red-600"
          aria-hidden="true"
        >*</span>
      </label>
      <input
        id="reg-email"
        v-model="registerForm.email"
        type="email"
        autocomplete="email"
        required
        aria-required="true"
        :placeholder="$t('register.email_placeholder')"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
      >
    </div>

    <div class="flex flex-col gap-2">
      <label
        for="reg-password"
        class="text-sm font-bold text-slate-700 dark:text-slate-300"
      >
        {{ $t('register.password_label') }} <span
          class="text-red-600"
          aria-hidden="true"
        >*</span>
      </label>
      <input
        id="reg-password"
        v-model="registerForm.password"
        type="password"
        autocomplete="new-password"
        required
        aria-required="true"
        placeholder="••••••••"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
      >
    </div>

    <button
      type="submit"
      class="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors focus:ring-4 focus:ring-emerald-500/50 outline-none cursor-pointer"
    >
      {{ $t('register.submit_button') }}
    </button>
    <p
      v-if="usersStore.errors && usersStore.errors.length > 0"
      class="mt-4 text-sm text-red-600 dark:text-red-400"
    >
      {{ $t('register.errors.' + usersStore.errors[0]) }}
    </p>
    <p
      v-else-if="usersStore.isLoading"
      class="mt-4 text-sm text-green-600 dark:text-green-400"
    >
      {{ $t('register.status.loading') }}
    </p>
  </form>
</template>
