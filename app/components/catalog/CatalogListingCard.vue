<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue'
import { useLocalePath } from '#imports'
import {
  CATALOG_CONDITION_BADGE_CLASS,
  CATALOG_SERVICE_BADGE_CLASS,
  type CatalogListing
} from '@/types/catalog'
import { useFavoritesStore } from '~/stores/favoritesStore'
import { useUsersStore } from '~/stores/usersStore'
import type { FavoriteAdvertSummary, FavoriteAdvertInput } from '~/types/favorite'

const localePath = useLocalePath()

const props = defineProps<{
  listing: CatalogListing
}>()

const detailLink = computed(() => localePath(`/adverts/${props.listing.id}`))

const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
const usersStore = useUsersStore()
const toast = useToast()
const { t } = useI18n()

const isSubmittingFavorite = ref(false)

const isInCart = computed(() =>
  cartStore.items.some(item => item.listing.id === String(props.listing.id))
)

const isFavorite = computed(() =>
  favoritesStore.isFavorite(String(props.listing.id))
)

const favoriteSummary = computed((): FavoriteAdvertSummary => ({
  id: String(props.listing.id),
  title: props.listing.title,
  type: props.listing.type,
  condition: props.listing.itemCondition ?? '',
  price: props.listing.price,
  image: props.listing.imageUrl,
  seller: props.listing.seller
}))

const favoriteInput = computed((): FavoriteAdvertInput => ({
  advertId: String(props.listing.id),
  advert: favoriteSummary.value
}))

const handleCartAdd = async () => {
  if (isInCart.value) return
  await cartStore.addToCart(props.listing)
  toast.add({
    title: t('cart.added_success'),
    color: 'success'
  })
}

const handleReservation = async () => {
  // TODO: Implement reservation logic
}

const toggleFavorite = async () => {
  if (isSubmittingFavorite.value) return
  isSubmittingFavorite.value = true
  try {
    await favoritesStore.toggleFavorite(favoriteInput.value)
  } catch {
    toast.add({
      title: t('favorites.status.error'),
      color: 'error'
    })
  } finally {
    isSubmittingFavorite.value = false
  }
}

onBeforeMount(() => {
  if (usersStore.isAuthenticated && !favoritesStore.hasLoaded && !favoritesStore.isLoading) {
    void favoritesStore.loadFavorites().catch(() => undefined)
  }
})
</script>

<template>
  <article class="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
    <div class="relative aspect-[520/440] bg-slate-100 dark:bg-slate-900">
      <img
        :src="listing.imageUrl"
        :alt="$t('catalog.card.alt_image')"
        loading="lazy"
        class="h-full w-full object-cover"
      >
      <span
        v-if="listing.itemCondition"
        class="absolute left-3 top-3 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm sm:text-[11px]"
        :class="CATALOG_CONDITION_BADGE_CLASS[listing.itemCondition]"
      >
        {{ $t(`catalog.badges.condition.${listing.itemCondition}`) }}
      </span>
      <span
        v-else-if="listing.serviceBadge"
        class="absolute left-3 top-3 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm sm:text-[11px]"
        :class="CATALOG_SERVICE_BADGE_CLASS[listing.serviceBadge]"
      >
        {{ $t(`catalog.badges.service.${listing.serviceBadge}`) }}
      </span>
    </div>

    <div class="flex flex-1 flex-col gap-3 p-4 sm:p-5">
      <p
        v-if="listing.metaLine"
        class="line-clamp-1 text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm"
      >
        {{ listing.metaLine }}
      </p>
      <h3 class="text-lg font-bold leading-snug text-slate-900 dark:text-white">
        <NuxtLink
          :to="detailLink"
          class="underline-offset-4 hover:text-emerald-700 hover:underline dark:hover:text-emerald-400"
        >
          {{ listing.title }}
        </NuxtLink>
      </h3>

      <p class="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
        <Icon
          name="material-symbols:location-on-outline"
          class="size-4 shrink-0"
        />
        {{ listing.location }}
      </p>

      <div class="mt-auto flex flex-wrap items-end justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <div class="leading-tight">
          <template v-if="listing.hourly">
            <span class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{{ $t('catalog.card.hourly') }} &nbsp;</span>
            <span class="text-xl font-black text-emerald-800 dark:text-emerald-400">{{ formatPrice(listing.price) }} CHF/h</span>
          </template>
          <template v-else>
            <span class="block text-xl font-black text-emerald-800 dark:text-emerald-400">{{ formatPrice(listing.price) }} CHF</span>
          </template>
        </div>
        <div
          v-if="listing.sellerId !== usersStore.user?.id"
          class="flex items-center gap-2"
        >
          <button
            v-if="usersStore.isAuthenticated && !usersStore.user?.isBanned"
            type="button"
            class="cursor-pointer size-10 flex items-center justify-center shrink-0 rounded-full border border-slate-200 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
            :aria-label="isFavorite ? $t('advert.actions.favorite_remove') : $t('advert.actions.favorite_add')"
            :disabled="isSubmittingFavorite"
            @click="toggleFavorite"
          >
            <Icon
              v-if="!isFavorite"
              name="material-symbols:favorite-outline"
              class="size-5 text-gray-900 dark:text-white"
            />
            <Icon
              v-else
              name="material-symbols:favorite"
              class="size-5 text-red-500"
            />
          </button>

          <button
            v-if="listing.hourly"
            type="button"
            class="rounded-full transition bg-emerald-800 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 cursor-pointer"
            @click="handleReservation"
          >
            {{ $t('catalog.card.book_lesson') }}
          </button>
          <button
            v-else
            type="button"
            class="rounded-full transition"
            :class="isInCart
              ? 'bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-600 border border-slate-200 dark:border-slate-800 cursor-not-allowed size-10 flex items-center justify-center shrink-0'
              : 'bg-emerald-800 text-white hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 cursor-pointer size-10 flex items-center justify-center shrink-0'"
            :disabled="isInCart"
            :aria-label="isInCart ? $t('advert.actions.already_in_cart') : $t('advert.actions.buy_now')"
            @click="handleCartAdd"
          >
            <Icon
              v-if="isInCart"
              name="material-symbols:check"
              class="size-5 text-emerald-650 dark:text-emerald-500 font-bold"
            />
            <Icon
              v-else
              name="material-symbols:shopping-cart-outline"
              class="size-5"
            />
          </button>
        </div>
      </div>
    </div>
  </article>
</template>
