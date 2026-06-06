<script setup lang="ts">
import type { ResetPasswordInput } from '~/types/user'
import FormErrors from '../common/FormErrors.vue'

const route = useRoute()
const usersStore = useUsersStore()

const code = route.query.token as string

const form = reactive({
  email: route.query.email as string || '',
  newPassword: '',
  confirmPassword: ''
})

const handleSubmit = async () => {
  const formData: ResetPasswordInput = {
    email: form.email,
    newPassword: form.newPassword,
    resetCode: code
  }

  await usersStore.resetPassword(formData, form.confirmPassword)
}

const { displayErrors } = useFormErrors(() => usersStore.errors, 'reset_password.errors')
</script>

<template>
  <form
    class="space-y-6 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"
    @submit.prevent="handleSubmit"
  >
    <div>
      <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
        {{ $t('reset_password.email_label') }} <span class="text-red-500">*</span>
      </label>
      <input
        v-model="form.email"
        type="email"
        disabled
        class="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-medium border border-slate-300 dark:border-slate-700 rounded-xl outline-none cursor-not-allowed opacity-70"
      >
    </div>

    <div>
      <label
        for="newPassword"
        class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
      >
        {{ $t('reset_password.password_label') }} <span class="text-red-500">*</span>
      </label>
      <input
        id="newPassword"
        v-model="form.newPassword"
        type="password"
        required
        placeholder="••••••••"
        class="w-full px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-600 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all"
      >
    </div>

    <div>
      <label
        for="confirmPassword"
        class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
      >
        {{ $t('reset_password.confirm_password_label') }} <span class="text-red-500">*</span>
      </label>
      <input
        id="confirmPassword"
        v-model="form.confirmPassword"
        type="password"
        required
        placeholder="••••••••"
        class="w-full px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-600 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all"
      >
    </div>

    <FormErrors :errors="displayErrors" />

    <button
      type="submit"
      :disabled="usersStore.isLoading"
      class="w-full mt-2 py-3 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold rounded-xl tracking-wide transition-all active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 outline-none"
    >
      {{ usersStore.isLoading ? $t('reset_password.status.loading') : $t('reset_password.submit_button') }}
    </button>
  </form>
</template>
