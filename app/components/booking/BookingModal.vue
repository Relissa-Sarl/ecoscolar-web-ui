<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ServiceRead } from '~/types/advert'
import { getPaymentService } from '~/services/paymentService'

const props = defineProps<{
  isOpen: boolean
  advert: ServiceRead | null
}>()

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()

const MIN_SESSIONS = props.advert?.minHours ?? 1
const MAX_SESSIONS = props.advert?.maxHours ?? 10
const PLATFORM_FEE_RATE = 0.10

const sessions = ref(MIN_SESSIONS)
const isLoading = ref(false)
const error = ref<string | null>(null)

const hourlyRate = computed(() => props.advert?.price ?? 0)
const subtotal = computed(() => hourlyRate.value * sessions.value)
const platformFee = computed(() => subtotal.value * PLATFORM_FEE_RATE)
const total = computed(() => subtotal.value + platformFee.value)

const sellerInitials = computed(() => {
  const name = props.advert?.seller?.username ?? ''
  return name.substring(0, 2).toUpperCase()
})

const decrementSessions = () => {
  if (sessions.value > MIN_SESSIONS) sessions.value--
}

const incrementSessions = () => {
  if (sessions.value < MAX_SESSIONS) sessions.value++
}

const handleClose = () => {
  if (isLoading.value) return
  emit('close')
  setTimeout(() => {
    sessions.value = MIN_SESSIONS
    error.value = null
  }, 300)
}

const handleConfirm = async () => {
  if (!props.advert) return

  isLoading.value = true
  error.value = null

  try {
    const paymentService = getPaymentService()
    const response = await paymentService.createCheckoutSession({
      productId: Number(props.advert.id),
      productPrice: total.value.toFixed(2),
      sessions: sessions.value
    })

    if (response?.url) {
      window.location.href = response.url
    } else {
      error.value = t('booking.errors.init_failed')
    }
  } catch (e: unknown) {
    error.value = (e instanceof Error ? e.message : null) ?? t('booking.errors.general')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="booking-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        @click.self="handleClose"
      >
        <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                <Icon
                  name="material-symbols:school-outline"
                  class="size-5 text-emerald-700 dark:text-emerald-400"
                />
              </div>
              <div>
                <h3
                  id="booking-modal-title"
                  class="text-lg font-bold text-slate-900 dark:text-white leading-tight"
                >
                  {{ t('booking.title') }}
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  {{ t('booking.subtitle') }}
                </p>
              </div>
            </div>
            <button
              type="button"
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              :disabled="isLoading"
              :aria-label="t('booking.close')"
              @click="handleClose"
            >
              <Icon
                name="material-symbols:close"
                class="size-5"
              />
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-5">
            <!-- Service summary card -->
            <div class="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
              <!-- Tutor avatar -->
              <div class="w-12 h-12 rounded-full bg-emerald-800 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {{ sellerInitials }}
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-slate-900 dark:text-white text-sm leading-tight truncate">
                  {{ advert?.title }}
                </h4>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {{ t('booking.tutor_label') }} <span class="font-medium text-slate-700 dark:text-slate-300">@{{ advert?.seller?.username }}</span>
                </p>
                <div class="flex flex-wrap gap-1.5 mt-2">
                  <span
                    v-if="advert?.subject"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold uppercase tracking-wide"
                  >
                    <Icon
                      name="material-symbols:book-outline"
                      class="size-3"
                    />
                    {{ advert.subject }}
                  </span>
                  <span
                    v-if="advert?.grade"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-[10px] font-semibold uppercase tracking-wide"
                  >
                    <Icon
                      name="material-symbols:school"
                      class="size-3"
                    />
                    {{ advert.grade }}
                  </span>
                  <span
                    v-if="advert?.school"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-semibold uppercase tracking-wide"
                  >
                    <Icon
                      name="material-symbols:location-on-outline"
                      class="size-3"
                    />
                    {{ advert.school }}
                  </span>
                </div>
              </div>
              <div class="text-right shrink-0">
                <span class="text-xs text-slate-400 dark:text-slate-500 block">{{ t('booking.rate_label') }}</span>
                <span class="text-lg font-black text-emerald-800 dark:text-emerald-400">{{ formatPrice(hourlyRate) }}</span>
                <span class="text-xs text-slate-500 dark:text-slate-400"> CHF/h</span>
              </div>
            </div>

            <!-- Sessions selector -->
            <div>
              <label class="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
                {{ t('booking.sessions_label') }}
              </label>
              <div class="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800">
                <button
                  type="button"
                  class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors font-bold text-xl disabled:opacity-30 disabled:cursor-not-allowed"
                  :disabled="sessions <= MIN_SESSIONS"
                  :aria-label="t('booking.decrease')"
                  @click="decrementSessions"
                >
                  −
                </button>
                <div class="text-center">
                  <span class="text-3xl font-black text-slate-900 dark:text-white">{{ sessions }}</span>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {{ sessions === 1 ? t('booking.session_singular') : t('booking.session_plural') }}
                  </p>
                </div>
                <button
                  type="button"
                  class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors font-bold text-xl disabled:opacity-30 disabled:cursor-not-allowed"
                  :disabled="sessions >= MAX_SESSIONS"
                  :aria-label="t('booking.increase')"
                  @click="incrementSessions"
                >
                  +
                </button>
              </div>
              <p class="text-xs text-slate-400 dark:text-slate-500 mt-2 text-center">
                {{ t('booking.sessions_hint', { min: MIN_SESSIONS, max: MAX_SESSIONS }) }}
              </p>
            </div>

            <!-- Price breakdown -->
            <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-3">
              <h5 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {{ t('booking.price_summary') }}
              </h5>
              <div class="flex justify-between items-center text-sm text-slate-600 dark:text-slate-400">
                <span>{{ t('booking.subtotal', { rate: formatPrice(hourlyRate), sessions }) }}</span>
                <span class="font-medium text-slate-900 dark:text-white">{{ formatPrice(subtotal) }} CHF</span>
              </div>
              <div class="flex justify-between items-center text-sm text-slate-600 dark:text-slate-400">
                <span>{{ t('booking.platform_fee') }}</span>
                <span class="font-medium text-slate-900 dark:text-white">{{ formatPrice(platformFee) }} CHF</span>
              </div>
              <div class="h-px bg-slate-200 dark:bg-slate-700" />
              <div class="flex justify-between items-center">
                <span class="font-bold text-slate-900 dark:text-white">{{ t('booking.total') }}</span>
                <span class="text-xl font-black text-emerald-800 dark:text-emerald-400">{{ formatPrice(total) }} CHF</span>
              </div>
            </div>

            <!-- Buyer protection -->
            <div class="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
              <Icon
                name="material-symbols:verified-user-outline"
                class="size-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5"
              />
              <div>
                <p class="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  {{ t('booking.protection_title') }}
                </p>
                <p class="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                  {{ t('booking.protection_text') }}
                </p>
              </div>
            </div>

            <!-- Error -->
            <div
              v-if="error"
              class="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800 text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              {{ error }}
            </div>
          </div>

          <!-- Footer -->
          <div class="flex flex-col-reverse sm:flex-row gap-3 p-6 pt-0">
            <button
              type="button"
              class="flex-1 py-3 px-5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              :disabled="isLoading"
              @click="handleClose"
            >
              {{ t('booking.cancel') }}
            </button>
            <button
              type="button"
              class="flex-1 py-3 px-5 rounded-xl text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              :disabled="isLoading"
              @click="handleConfirm"
            >
              <svg
                v-if="isLoading"
                class="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <Icon
                v-else
                name="material-symbols:lock-outline"
                class="size-4"
              />
              <span>{{ isLoading ? t('booking.loading') : t('booking.confirm') }}</span>
            </button>
          </div>

          <!-- Terms note -->
          <p class="text-center text-xs text-slate-400 dark:text-slate-500 pb-5 px-6">
            {{ t('booking.terms_note') }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.booking-fade-enter-active,
.booking-fade-leave-active {
  transition: opacity 0.25s ease;
}
.booking-fade-enter-from,
.booking-fade-leave-to {
  opacity: 0;
}
</style>
