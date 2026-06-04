import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useUsersStore } from './usersStore'
import type { CatalogListing } from '../types/catalog'

import { getCartService } from '../services/cartService'
import type { CartItemDto } from '../types/cart'

export interface CartStoreItem {
  listing: CatalogListing
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartStoreItem[]>([])
  const usersStore = useUsersStore()
  const isLoading = ref(false)
  const hasLoaded = ref(false)
  const error = ref<string | null>(null)

  const user = computed(() => usersStore.user)
  const cartKey = computed(() => user.value ? `ecoscolar_cart_${user.value.id}` : null)

  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + item.listing.price * item.quantity, 0)
  })

  const saveCart = () => {
    if (typeof localStorage !== 'undefined' && cartKey.value) {
      localStorage.setItem(cartKey.value, JSON.stringify(items.value))
    }
  }

  const loadCart = async (force = false) => {
    if (hasLoaded.value && !force) {
      return
    }

    // Load from localStorage synchronously first (optimistic load)
    if (typeof localStorage !== 'undefined' && cartKey.value) {
      const data = localStorage.getItem(cartKey.value)
      if (data) {
        try {
          const parsed = JSON.parse(data)
          items.value = Array.isArray(parsed)
            ? parsed.map((item: CartStoreItem) => ({ ...item, quantity: 1 }))
            : []
        } catch {
          items.value = []
        }
      } else {
        items.value = []
      }
    } else {
      items.value = []
    }

    if (usersStore.isAuthenticated) {
      isLoading.value = true
      error.value = null
      try {
        const cartService = getCartService()
        const apiItems = await cartService.getCartItems()

        // Group items by advertId (each item only once)
        const grouped: Record<number, { dto: CartItemDto, qty: number }> = {}
        for (const item of apiItems) {
          let entry = grouped[item.advertId]
          if (!entry) {
            entry = { dto: item, qty: 1 }
            grouped[item.advertId] = entry
          }
        }

        items.value = Object.values(grouped).map(({ dto, qty }) => ({
          listing: {
            id: String(dto.advertId),
            title: dto.title,
            price: dto.price,
            categoryTab: dto.type === 'BOOK' ? 'textbooks' : (dto.type === 'PRODUCT' ? 'supplies' : 'tutoring'),
            imageUrl: dto.primaryImage || '',
            location: '',
            hourly: dto.type === 'SERVICE',
            metaLineKey: dto.type === 'BOOK' ? 'catalog.card.meta_textbooks' : (dto.type === 'PRODUCT' ? 'catalog.card.meta_supplies' : 'catalog.card.meta_tutoring'),
            seller: dto.sellerPseudo
          },
          quantity: qty
        }))
        saveCart()
        hasLoaded.value = true
      } catch (e) {
        error.value = e instanceof Error ? e.message : 'Unable to load cart'
        console.error('Failed to load cart', e)
      } finally {
        isLoading.value = false
      }
    } else {
      hasLoaded.value = true
    }
  }

  // Watch for user changes to automatically reload cart scoped to the active user
  watch(
    cartKey,
    () => {
      hasLoaded.value = false
      void loadCart()
    },
    { immediate: true }
  )

  const addToCart = async (listing: CatalogListing) => {
    const existing = items.value.find(item => item.listing.id === listing.id)
    if (existing) {
      return
    }
    items.value.push({ listing, quantity: 1 })
    saveCart()

    if (usersStore.isAuthenticated) {
      try {
        const cartService = getCartService()
        await cartService.addToCart({ advertId: Number(listing.id) })
      } catch (e) {
        console.error('Failed to add to cart on backend', e)
      }
    }
  }

  const removeFromCart = async (listingId: string) => {
    items.value = items.value.filter(item => item.listing.id !== listingId)
    saveCart()

    if (usersStore.isAuthenticated) {
      try {
        const cartService = getCartService()
        await cartService.removeFromCart(Number(listingId))
      } catch (e) {
        console.error('Failed to remove from cart on backend', e)
      }
    }
  }

  const updateQuantity = (listingId: string, quantity: number) => {
    const existing = items.value.find(item => item.listing.id === listingId)
    if (existing) {
      if (quantity <= 0) {
        void removeFromCart(listingId)
      } else {
        existing.quantity = quantity
        saveCart()
      }
    }
  }

  const clearCart = async () => {
    const itemsToRemove = [...items.value]
    items.value = []
    saveCart()

    if (usersStore.isAuthenticated) {
      try {
        const cartService = getCartService()
        for (const item of itemsToRemove) {
          await cartService.removeFromCart(Number(item.listing.id))
        }
      } catch (e) {
        console.error('Failed to clear cart on backend', e)
      }
    }
  }

  return {
    items,
    totalItems,
    totalPrice,
    isLoading,
    hasLoaded,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCart
  }
})
