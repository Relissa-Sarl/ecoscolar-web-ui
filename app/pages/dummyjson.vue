<template>
  <div class="mx-auto max-w-2xl p-6">
    <h1 class="mb-4 text-xl font-semibold">
      Exemple DummyJSON (simple)
    </h1>

    <div class="mb-4 flex gap-2">
      <input
        v-model="searchInput"
        type="text"
        placeholder="Rechercher un produit..."
        class="w-full rounded border px-3 py-2"
        @keyup.enter="search"
      >
      <button
        type="button"
        class="rounded bg-blue-600 px-4 py-2 text-white"
        @click="search"
      >
        OK
      </button>
      <button
        type="button"
        class="rounded border px-4 py-2"
        @click="resetSearch"
      >
        Reset
      </button>
    </div>

    <p v-if="pending">
      Chargement...
    </p>

    <p
      v-else-if="error"
      class="text-red-600"
    >
      Erreur: {{ error.message }}
    </p>

    <ul
      v-else
      class="space-y-2"
    >
      <li
        v-for="product in products"
        :key="product.id"
        class="rounded border p-3"
      >
        <p class="font-medium">
          {{ product.title }}
        </p>
        <p class="text-sm text-gray-600">
          Prix: ${{ product.price }}
        </p>
      </li>

      <li
        v-if="products.length === 0"
        class="text-sm text-gray-600"
      >
        Aucun resultat
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { getDummyjsonProducts } from '~/services/dummyjsonProductService'

const toast = useToast()
const searchInput = ref('')
const searchTerm = ref('')

const fetchProducts = () => {
  return getDummyjsonProducts({
    q: searchTerm.value || undefined
  })
}

const { data, pending, error, refresh } = await useAsyncData(
  'dummyjson-products',
  fetchProducts,
  {
    default: () => ({ products: [] }),
    watch: [searchTerm]
  }
)

const products = computed(() => data.value?.products ?? [])

const search = () => {
  searchTerm.value = searchInput.value.trim()
  toast.add({
    title: 'Recherche',
    description: searchTerm.value ? `Filtre: ${searchTerm.value}` : 'Liste complete',
    color: 'primary'
  })
}

const resetSearch = () => {
  searchInput.value = ''
  searchTerm.value = ''
  refresh()
  toast.add({
    title: 'Reset',
    description: 'Filtre supprime',
    color: 'neutral'
  })
}
</script>
