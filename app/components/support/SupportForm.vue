<script setup lang="ts">
import type { SupportContactRequest } from '~/types/support'
import { getSupportService } from '~/services/supportService'
import { useSupportTicketsStore } from '~/stores/supportTicketsStore'
import { SupportReason } from '~/utils/enum/supportReason'
import {
  resolveSupportSubject,
  SUPPORT_MESSAGE_MIN_LENGTH,
  validateSupportForm
} from '~/utils/supportFormUtils'

const { t } = useI18n()
const router = useRouter()
const localePath = useLocalePath()
const toast = useToast()
const usersStore = useUsersStore()
const supportTicketsStore = useSupportTicketsStore()
const supportService = getSupportService()

const reasonOptions = Object.entries(SupportReason).map(([key, value]) => ({
  key,
  value
}))

const form = ref({
  email: '',
  reason: '',
  message: ''
})

const fieldErrors = ref<Partial<Record<'email' | 'reason' | 'message', string>>>({})
const isSubmitting = ref(false)

function setFieldError(field: 'email' | 'reason' | 'message', key?: string | null) {
  if (!key) {
    const { [field]: _removed, ...rest } = fieldErrors.value
    fieldErrors.value = rest
    return
  }
  fieldErrors.value = {
    ...fieldErrors.value,
    [field]: t(`support.validation.${key}`)
  }
}

function clearFieldErrors() {
  fieldErrors.value = {}
}

watch(
  () => usersStore.user?.email,
  (email) => {
    if (email && !form.value.email)
      form.value.email = email
  },
  { immediate: true }
)

function extractSubmitErrorMessage(error: unknown): string | null {
  if (!error || typeof error !== 'object') return null

  const data = (error as { data?: { errors?: Record<string, string[]> } }).data
  const firstFieldError = data?.errors
    ? Object.values(data.errors).flat().find(Boolean)
    : null

  return firstFieldError ?? null
}

const handleSubmit = async () => {
  if (isSubmitting.value) return

  const subject = resolveSupportSubject(form.value.reason, t)
  const validationError = validateSupportForm({
    email: form.value.email,
    reason: form.value.reason,
    message: form.value.message,
    subject
  })

  clearFieldErrors()

  if (validationError) {
    if (validationError === 'subject') {
      setFieldError('reason', 'reason')
    } else {
      setFieldError(validationError, validationError)
    }
    return
  }

  isSubmitting.value = true
  try {
    const body: SupportContactRequest = {
      email: form.value.email.trim(),
      subject: form.value.reason.toString(),
      message: form.value.message.trim()
    }
    await supportService.submitContact(body)
    supportTicketsStore.clearTickets()
    toast.add({
      title: t('support.success'),
      color: 'success'
    })
    if (usersStore.isAuthenticated)
      await router.push(localePath('/me/support-requests'))
    else
      await router.push(localePath('/'))
  } catch (error) {
    const apiMessage = extractSubmitErrorMessage(error)
    if (apiMessage?.toLowerCase().includes('message')) {
      fieldErrors.value.message = apiMessage
    } else {
      toast.add({
        title: apiMessage ?? t('support.error_submit'),
        color: 'error'
      })
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

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
        :aria-invalid="!!fieldErrors.email"
        :placeholder="$t('support.fields.email_placeholder')"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
        :class="fieldErrors.email ? 'border-red-500 focus:ring-red-500' : ''"
        @input="setFieldError('email')"
      >
      <p
        v-if="fieldErrors.email"
        class="text-sm text-red-600 dark:text-red-400"
        role="alert"
      >
        {{ fieldErrors.email }}
      </p>
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
        :aria-invalid="!!fieldErrors.reason"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer"
        :class="fieldErrors.reason ? 'border-red-500 focus:ring-red-500' : ''"
        @change="setFieldError('reason')"
      >
        <option
          v-for="reason in reasonOptions"
          :key="reason.key"
          :value="reason.value"
          :disabled="reason.value === SupportReason.REASON_PLACEHOLDER"
        >
          {{ reason.value === SupportReason.REASON_PLACEHOLDER ? $t(`support.fields.${reason.key.toLocaleLowerCase()}`) : $t(`support.reasons.${reason.key.toLocaleLowerCase()}`) }}
        </option>
      </select>
      <p
        v-if="fieldErrors.reason"
        class="text-sm text-red-600 dark:text-red-400"
        role="alert"
      >
        {{ fieldErrors.reason }}
      </p>
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
      <p class="text-xs text-slate-500 dark:text-slate-400">
        {{ $t('support.fields.message_hint', { min: SUPPORT_MESSAGE_MIN_LENGTH }) }}
      </p>
      <textarea
        id="message"
        v-model="form.message"
        rows="5"
        required
        aria-required="true"
        :aria-invalid="!!fieldErrors.message"
        :minlength="SUPPORT_MESSAGE_MIN_LENGTH"
        :placeholder="$t('support.fields.message_placeholder')"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
        :class="fieldErrors.message ? 'border-red-500 focus:ring-red-500' : ''"
        @input="setFieldError('message')"
      />
      <p
        v-if="fieldErrors.message"
        class="text-sm text-red-600 dark:text-red-400"
        role="alert"
      >
        {{ fieldErrors.message }}
      </p>
    </div>

    <div class="pt-4">
      <button
        type="submit"
        class="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors focus:ring-4 focus:ring-emerald-500/50 outline-none disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="isSubmitting"
      >
        {{ $t('support.actions.submit') }}
      </button>
    </div>
  </form>
</template>
