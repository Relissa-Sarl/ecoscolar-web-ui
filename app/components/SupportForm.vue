<template>
  <form
    class="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm"
    @submit.prevent="handleSubmit"
  >
    <div class="flex flex-col gap-2">
      <label
        for="email"
        class="text-sm font-bold text-slate-700 dark:text-slate-300"
      >
        {{ $t('support.fields.email') }} <span
          class="text-red-600"
          aria-hidden="true"
        >*</span>
      </label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        required
        aria-required="true"
        :placeholder="$t('support.fields.email_placeholder')"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
      >
    </div>

    <div class="flex flex-col gap-2">
      <label
        for="reason"
        class="text-sm font-bold text-slate-700 dark:text-slate-300"
      >
        {{ $t('support.fields.reason') }} <span
          class="text-red-600"
          aria-hidden="true"
        >*</span>
      </label>
      <select
        id="reason"
        v-model="form.reason"
        required
        aria-required="true"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer"
      >
        <option
          value=""
          disabled
        >
          {{ $t('support.fields.reason_placeholder') }}
        </option>
        <option value="account">
          {{ $t('support.reasons.account') }}
        </option>
        <option value="order">
          {{ $t('support.reasons.order') }}
        </option>
        <option value="bug">
          {{ $t('support.reasons.bug') }}
        </option>
        <option value="other">
          {{ $t('support.reasons.other') }}
        </option>
      </select>
    </div>

    <div class="flex flex-col gap-2">
      <label
        for="message"
        class="text-sm font-bold text-slate-700 dark:text-slate-300"
      >
        {{ $t('support.fields.message') }} <span
          class="text-red-600"
          aria-hidden="true"
        >*</span>
      </label>
      <textarea
        id="message"
        v-model="form.message"
        rows="5"
        required
        aria-required="true"
        :placeholder="$t('support.fields.message_placeholder')"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
      />
    </div>

    <div class="flex flex-col sm:flex-row gap-4 pt-4">
      <button
        type="submit"
        class="flex-1 bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors focus:ring-4 focus:ring-emerald-500/50 outline-none"
      >
        {{ $t('support.actions.submit') }}
      </button>
      <button
        type="button"
        class="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-300 font-bold py-3 px-6 rounded-lg transition-colors focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-700 outline-none"
        @click="handleCancel"
      >
        {{ $t('support.actions.cancel') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
// On récupère t pour les messages d'alerte dans le script
const { t } = useI18n()
const router = useRouter()
const localePath = useLocalePath()

const form = ref({
  email: '',
  reason: '',
  message: ''
})

const handleSubmit = () => {
  // TODO: send support request to API
  alert(t('support.success'))
  router.push(localePath('/'))
}

const handleCancel = () => {
  if (confirm(t('support.actions.confirm_cancel'))) {
    router.push(localePath('/'))
  }
}
</script>
