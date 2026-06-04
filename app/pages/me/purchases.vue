<script setup lang="ts">
import { useI18n } from '#imports'
import { useHistory } from '~/composables/useHistory' // On importe notre nouveau composable

const { t } = useI18n()

// On récupère la fonction pour obtenir les achats
const { getPurchases } = useHistory()

// On utilise useAsyncData pour charger les données
// 'user-purchases' est une clé unique pour le cache de Nuxt
const { data: purchases, pending, error } = await useAsyncData(
  'user-purchases',
  () => getPurchases()
)
</script>

<template>
  <div class="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-8">
      {{ t('me.purchases.title') }}
    </h1>

    <!-- État de chargement -->
    <div v-if="pending" class="text-center py-12">
      <p class="text-slate-500">Chargement de vos achats...</p>
    </div>

    <!-- S'il y a une erreur -->
    <div v-else-if="error" class="text-center py-12 text-red-600 bg-red-50 rounded-xl">
      <p>Une erreur est survenue lors de la récupération de vos achats.</p>
    </div>

    <!-- Si la liste est vide -->
    <div v-else-if="!purchases || purchases.length === 0" class="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
      <p class="text-slate-500">
        {{ t('me.purchases.empty_placeholder') }}
      </p>
    </div>

    <!-- S'il y a des données, on les affiche de manière brute (temporaire) -->
    <div v-else class="grid gap-4">
      <div
        v-for="purchase in purchases"
        :key="purchase.id"
        class="border border-slate-200 p-4 rounded-xl shadow-sm bg-white"
      >
        <p class="font-bold">{{ purchase.advertTitle }}</p>
        <p class="text-sm text-slate-500">Vendu par : {{ purchase.sellerName }}</p>
        <p class="text-emerald-600 font-semibold mt-2">{{ purchase.price }} CHF</p>
        <p class="text-xs text-slate-400 mt-1">Acheté le : {{ purchase.purchaseDate }}</p>
        <span class="inline-block mt-2 text-xs px-2 py-1 bg-slate-100 rounded-md">
          Statut : {{ purchase.status }}
        </span>
      </div>
    </div>
  </div>
</template>
