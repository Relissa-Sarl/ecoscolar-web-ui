import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useUsersStore } from './usersStore'
import type { CatalogListing } from '../types/catalog'

export interface CartStoreItem {
  listing: CatalogListing
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartStoreItem[]>([])
  const usersStore = useUsersStore()

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

  const loadCart = () => {
    if (typeof localStorage !== 'undefined' && cartKey.value) {
      const data = localStorage.getItem(cartKey.value)
      if (data) {
        items.value = JSON.parse(data)
      } else {
        items.value = []
      }
    } else {
      items.value = []
    }
  }

  // Watch for user changes to automatically reload cart scoped to the active user
  watch(
    cartKey,
    () => {
      loadCart()
    },
    { immediate: true }
  )

  const addToCart = (listing: CatalogListing) => {
    const existing = items.value.find(item => item.listing.id === listing.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ listing, quantity: 1 })
    }
    saveCart()
  }

  const removeFromCart = (listingId: string) => {
    items.value = items.value.filter(item => item.listing.id !== listingId)
    saveCart()
  }

  const updateQuantity = (listingId: string, quantity: number) => {
    const existing = items.value.find(item => item.listing.id === listingId)
    if (existing) {
      if (quantity <= 0) {
        removeFromCart(listingId)
      } else {
        existing.quantity = quantity
        saveCart()
      }
    }
  }

  const clearCart = () => {
    items.value = []
    saveCart()
  }

  return {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCart
  }
})
