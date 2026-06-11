<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { StripeStatus } from '~/types/user'
import { getUserService } from '~/services/usersService'

/**
 * Seller payments card (Stripe Connect Express).
 * Shows the current onboarding status of the seller and lets them start (or resume)
 * the Stripe-hosted onboarding flow.
 */
const userService = getUserService()

const status = ref<StripeStatus | null>(null)
const isLoading = ref<boolean>(true)
const isRedirecting = ref<boolean>(false)
const hasError = ref<boolean>(false)

const loadStatus = async () => {
  isLoading.value = true
  hasError.value = false
  try {
    status.value = await userService.getStripeStatus()
  } catch (error) {
    console.error('Failed to load Stripe status:', error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

const startOnboarding = async () => {
  isRedirecting.value = true
  hasError.value = false
  try {
    const { url } = await userService.createStripeOnboardingLink()
    // Redirect to the Stripe-hosted onboarding page
    window.location.href = url
  } catch (error) {
    console.error('Failed to create Stripe onboarding link:', error)
    hasError.value = true
    isRedirecting.value = false
  }
}
onMounted(loadStatus)
</script>

<template>
  <div class="w-full max-w-100 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center shadow-sm">
    <div class="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-slate-900 border-4 border-emerald-50 dark:border-slate-900 text-emerald-600 dark:text-emerald-400">
      <UIcon
        name="i-lucide-wallet"
        class="w-6 h-6"
      />
    </div>

    <h3 class="text-lg font-semibold text-slate-800 dark:text-white mb-3 text-center">
      {{ $t('profile.stripe.payments') }}
    </h3>

    <hr class="w-full border-slate-100 dark:border-slate-800 mb-5">

    <div
      v-if="isLoading"
      class="w-full space-y-4 animate-pulse px-2"
    >
      <div class="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
      <div class="h-3 bg-slate-100 dark:bg-slate-800 rounded w-2/3 mx-auto" />
      <div class="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl w-full mt-6" />
    </div>

    <div
      v-else-if="hasError"
      class="w-full px-2 text-center"
    >
      <p class="text-sm text-red-500 mb-4">
        {{ $t('profile.stripe.errors.loading') }}
      </p>
      <button
        class="text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center justify-center gap-2 w-full"
        @click="loadStatus"
      >
        <UIcon
          name="i-lucide-refresh-cw"
          class="w-4 h-4"
        />
        {{ $t('profile.stripe.errors.retry') }}
      </button>
    </div>

    <div
      v-else
      class="w-full flex flex-col items-center"
    >
      <div
        class="text-xs font-bold px-3 py-1 rounded-full mb-4"
        :class="status?.isStripeOnboarded
          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'"
      >
        {{ status?.isStripeOnboarded ? $t('profile.stripe.configured.tag') : $t('profile.stripe.not_configured.tag') }}
      </div>

      <p class="text-sm text-slate-500 dark:text-slate-400 text-center leading-relaxed mb-6 px-2">
        {{ status?.isStripeOnboarded
          ? $t('profile.stripe.configured.description')
          : $t('profile.stripe.not_configured.description')
        }}
      </p>

      <UButton
        block
        :loading="isRedirecting"
        :color="status?.isStripeOnboarded ? 'neutral' : 'primary'"
        variant="solid"
        class="rounded-xl font-bold py-2.5"
        @click="startOnboarding"
      >
        {{ status?.isStripeOnboarded ? $t('profile.stripe.configured.manage_account') : $t('profile.stripe.not_configured.configure_account') }}
      </UButton>

      <hr class="w-full border-slate-100 dark:border-slate-800 my-5">

      <div class="flex items-center gap-1.5 opacity-50">
        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{{ $t('profile.stripe.secured_by') }}</span>
        <UIcon
          name="i-simple-icons-stripe"
          class="w-8 h-4 text-slate-400 dark:text-slate-500"
        />
      </div>
    </div>
  </div>
</template>
