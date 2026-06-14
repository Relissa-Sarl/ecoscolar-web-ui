<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import type { FavoriteAdvertSummary } from '~/types/favorite'
import { AdvertType } from '~/utils/enum/advertType'
import type { CatalogListing } from '~/types/catalog'
import { useCartStore } from '~/stores/cartStore'
import { useUsersStore } from '~/stores/usersStore'

interface Props {
  advert: FavoriteAdvertSummary | null
}

const props = defineProps<Props>()
const { t } = useI18n()
const toast = useToast()

const favoritesStore = useFavoritesStore()
const usersStore = useUsersStore()
const isSubmittingFavorite = ref(false)

const resolvedAdvertId = computed(() => props.advert?.id ?? null)

// Extraction des champs pour pinia
const favoriteInput = computed(() => {
  if (!props.advert) {
    return null
  }

  return {
    advertId: props.advert.id,
    advert: props.advert
  }
})

const isFavorite = computed(() => {
  if (!resolvedAdvertId.value) {
    return false
  }
  return favoritesStore.isFavorite(resolvedAdvertId.value)
})

const favoriteLabel = computed(() =>
  isFavorite.value ? 'advert.actions.favorite_remove' : 'advert.actions.favorite_add'
)

const cartStore = useCartStore()

const isInCart = computed(() => {
  if (!resolvedAdvertId.value) {
    return false
  }
  return cartStore.items.some(item => item.listing.id === String(resolvedAdvertId.value))
})

/**
 * Converts an Advert into a CatalogListing format for easier handling in the cart and favorites.
 */
const listing = computed(() => {
  if (!props.advert)
    return null

  const advert = props.advert

  return {
    id: String(advert.id),
    title: advert.title,
    price: advert.price,
    type: advert.type,
    categoryTab: advert.type === AdvertType.BOOK ? 'textbooks' : (advert.type === AdvertType.PRODUCT ? 'supplies' : 'tutoring'),
    imageUrl: advert.image || '',
    location: '',
    hourly: advert.type === AdvertType.SERVICE,
    seller: advert.seller
  } as CatalogListing
})

const handleCardAdd = async () => {
  if (!listing.value || isInCart.value) return

  await cartStore.addToCart(listing.value)
  toast.add({
    title: t('cart.added_success'),
    color: 'success'
  })
}

const handleReservation = async () => {
  // TODO: Implement reservation logic
}

const toggleFavorite = async () => {
  if (!favoriteInput.value || isSubmittingFavorite.value) {
    return
  }
  isSubmittingFavorite.value = true

  try {
    await favoritesStore.toggleFavorite(favoriteInput.value)
  } finally {
    isSubmittingFavorite.value = false
  }
}

onBeforeMount(() => {
  if (usersStore.isAuthenticated) {
    if (!favoritesStore.hasLoaded && !favoritesStore.isLoading) {
      void favoritesStore.loadFavorites().catch(() => undefined)
    }
    if (!cartStore.hasLoaded && !cartStore.isLoading) {
      void cartStore.loadCart().catch(() => undefined)
    }
  }
})
</script>

<template>
  <div class="space-y-3">
    <div class="flex gap-3">
      <button
        v-if="advert?.type === AdvertType.SERVICE"
        class="flex-1 px-4 py-3 font-medium rounded-lg transition-colors flex items-center justify-center bg-green-700 hover:bg-green-800 text-white cursor-pointer"
        @click="handleReservation"
      >
        {{ $t('catalog.card.book_lesson') }}
      </button>
      <button
        v-else
        class="flex-1 px-4 py-3 font-medium rounded-lg transition-colors flex items-center justify-center"
        :class="isInCart
          ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700'
          : 'bg-green-700 hover:bg-green-800 text-white cursor-pointer'"
        :disabled="isInCart"
        @click="handleCardAdd"
      >
        {{ isInCart ? $t('advert.actions.already_in_cart') : $t('advert.actions.buy_now') }}
      </button>

      <button
        v-if="usersStore.isAuthenticated && !usersStore.user?.isBanned"
        type="button"
        class="w-12 h-12 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors flex items-center justify-center text-lg"
        :aria-label="$t(favoriteLabel)"
        :aria-pressed="isFavorite"
        :disabled="isSubmittingFavorite || !favoriteInput"
        @click="toggleFavorite"
      >
        <Icon
          v-if="!isFavorite"
          name="material-symbols:favorite-outline"
          class="size-6 text-gray-900 dark:text-white"
        />
        <Icon
          v-else
          name="material-symbols:favorite"
          class="size-6 text-red-500"
        />
      </button>
    </div>
  </div>
</template>
