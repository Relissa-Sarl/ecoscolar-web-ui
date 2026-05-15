<script setup lang="ts">
const form = ref({ name: '', email: '', password: '' })
const handleRegister = () => {
  // TODO: call register API with form fields and handle validation errors
}
</script>

<template>
  <form
    class="space-y-6 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"
    @submit.prevent="handleRegister"
  >
    <div class="flex flex-col gap-2">
      <label
        for="reg-name"
        class="text-sm font-bold text-slate-700 dark:text-slate-300"
      >
        {{ $t('register.name_label') }} <span
          class="text-red-600"
          aria-hidden="true"
        >*</span>
      </label>
      <input
        id="reg-name"
        v-model="form.name"
        type="text"
        autocomplete="name"
        required
        aria-required="true"
        :placeholder="$t('register.name_placeholder')"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
      >
    </div>

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
        v-model="form.email"
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
        v-model="form.password"
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
      class="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors focus:ring-4 focus:ring-emerald-500/50 outline-none"
    >
      {{ $t('register.submit_button') }}
    </button>
  </form>
</template>
