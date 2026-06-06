<script setup lang="ts">
import FormErrors from '../common/FormErrors.vue'

const email = ref('')

const usersStore = useUsersStore()

const handleResetRequest = async () => {
  await usersStore.forgotPassword(email.value)
}

const { displayErrors } = useFormErrors(() => usersStore.errors, 'reset_password.errors')
</script>

<template>
  <form
    class="space-y-6 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"
    @submit.prevent="handleResetRequest"
  >
    <p class="text-sm text-slate-600 dark:text-slate-300">
      {{ $t('forgot_password.instruction') }}
    </p>

    <div class="flex flex-col gap-2">
      <label
        for="forgot-email"
        class="text-sm font-bold text-slate-700 dark:text-slate-300"
      >
        {{ $t('login.email_label') }} <span
          class="text-red-600"
          aria-hidden="true"
        >*</span>
      </label>
      <input
        id="forgot-email"
        v-model="email"
        type="email"
        autocomplete="email"
        required
        aria-required="true"
        :placeholder="$t('login.email_placeholder')"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
      >
    </div>

    <p
      v-if="usersStore.hasLoaded"
      class="text-sm text-emerald-700 dark:text-emerald-400 font-medium"
    >
      {{ $t('forgot_password.instruction_success') }}
    </p>

    <FormErrors :errors="displayErrors" />

    <button
      type="submit"
      class="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors focus:ring-4 focus:ring-emerald-500/50 outline-none cursor-pointer"
    >
      {{ $t('forgot_password.submit_button') }}
    </button>
  </form>
</template>
