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
  <div class="w-full max-w-[320px] bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
    Hello Damien
    <UButton :on-click="startOnboarding">
      Hello Damien
    </UButton>
  </div>
</template>
