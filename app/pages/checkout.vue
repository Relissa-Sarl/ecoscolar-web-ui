<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPaymentsService } from '~/services/paymentsService'

const route = useRoute()
const paymentsService = getPaymentsService()

const advertId = ref<number | null>(null)
const shippingAddress = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)

onMounted(() => {
  const id = route.query.advertId
  if (id && !Array.isArray(id)) {
    advertId.value = parseInt(id, 10)
  }
})

const submitCheckout = async () => {
  if (!advertId.value) return
  if (!shippingAddress.value.trim()) {
    error.value = "L'adresse d'expédition est requise."
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const response = await paymentsService.checkout({
      advertId: advertId.value,
      shippingAddress: shippingAddress.value.trim()
    })
    
    if (response && response.url) {
      window.location.href = response.url // Redirection vers Stripe
    } else {
      error.value = "Erreur lors de l'initialisation du paiement."
    }
  } catch (e: any) {
    error.value = e.message || "Une erreur est survenue lors de la validation."
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
    <div class="max-w-2xl mx-auto">
      <div class="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/75 dark:bg-slate-900/70 backdrop-blur-md shadow-sm">
        <h1 class="text-3xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
          Validation de la commande
        </h1>
        
        <p class="mb-8 text-slate-600 dark:text-slate-400">
          Veuillez indiquer votre adresse d'expédition pour continuer vers le paiement sécurisé.
        </p>

        <form @submit.prevent="submitCheckout" class="space-y-6">
          <div>
            <label for="shippingAddress" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Adresse d'expédition complète
            </label>
            <textarea
              id="shippingAddress"
              v-model="shippingAddress"
              rows="4"
              required
              class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none text-slate-900 dark:text-slate-100"
              placeholder="Nom, Prénom&#10;Rue, Numéro&#10;NPA, Localité"
            ></textarea>
          </div>

          <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="isLoading || !shippingAddress"
            class="w-full bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all focus:ring-4 focus:ring-emerald-500/50 outline-none flex justify-center items-center gap-2"
          >
            <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-else>Procéder au paiement (Stripe)</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
