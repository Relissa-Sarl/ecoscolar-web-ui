import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { CatalogListing } from '../types/catalog'

export interface CartStoreItem {
  listing: CatalogListing
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartStoreItem[]>([])
  const isLoading = ref(false)
  const hasLoaded = ref(false)
  const error = ref<string | null>(null)

  const cartKey = computed(() => 'ecoscolar_cart')

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

    // Load from localStorage
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

    hasLoaded.value = true
  }

  // Load the cart from localStorage on client side
  if (process.client) {
    void loadCart()
  }

  const addToCart = async (listing: CatalogListing) => {
    const existing = items.value.find(item => item.listing.id === listing.id)
    if (existing) {
      return
    }
    items.value.push({ listing, quantity: 1 })
    saveCart()
  }

  const removeFromCart = async (listingId: string) => {
    items.value = items.value.filter(item => item.listing.id !== listingId)
    saveCart()
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
    items.value = []
    saveCart()
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
