import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { CatalogListing } from '../types/catalog'
import { getCartService } from '../services/cartService'
import { useUsersStore } from './usersStore'
import { AdvertType } from '../utils/enum/advertType'
import type { CartItemDto } from '../types/cart'

export interface CartStoreItem {
  listing: CatalogListing
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartStoreItem[]>([])
  const isLoading = ref(false)
  const hasLoaded = ref(false)
  const error = ref<string | null>(null)

  const cartService = getCartService()
  const usersStore = useUsersStore()

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

  const mapCartItemToCatalogListing = (dto: CartItemDto): CatalogListing => {
    const isHourly = dto.type === AdvertType.SERVICE
    const categoryTab
      = dto.type === AdvertType.BOOK
        ? 'textbooks'
        : dto.type === AdvertType.PRODUCT
          ? 'supplies'
          : 'tutoring'

    const metaLineKey
      = dto.type === AdvertType.BOOK
        ? 'catalog.card.meta_textbooks'
        : dto.type === AdvertType.PRODUCT
          ? 'catalog.card.meta_supplies'
          : 'catalog.card.meta_tutoring'

    return {
      id: String(dto.advertId),
      title: dto.title,
      price: dto.price,
      categoryTab,
      metaLineKey,
      location: '', // not returned by API
      imageUrl: dto.primaryImage || '',
      hourly: isHourly,
      seller: dto.sellerPseudo
    }
  }

  const loadCart = async (force = false) => {
    if (import.meta.server) {
      return
    }

    if (hasLoaded.value && !force) {
      return
    }

    isLoading.value = true
    error.value = null

    try {
      if (usersStore.isAuthenticated) {
        // 1. Sync guest cart items to backend if there are any
        if (typeof localStorage !== 'undefined' && cartKey.value) {
          const data = localStorage.getItem(cartKey.value)
          if (data) {
            try {
              const localItems: CartStoreItem[] = JSON.parse(data)
              if (Array.isArray(localItems) && localItems.length > 0) {
                for (const item of localItems) {
                  try {
                    await cartService.addToCart({ advertId: Number(item.listing.id) })
                  } catch (e) {
                    console.error('Failed to sync guest cart item to backend:', e)
                  }
                }
              }
            } catch {
              // Ignore parsing errors for malformed local storage data
            }
            // Clear the guest cart from localStorage
            localStorage.removeItem(cartKey.value)
          }
        }

        // 2. Fetch the cart items from backend
        const apiItems = await cartService.getCartItems()
        items.value = apiItems.map(dto => ({
          listing: mapCartItemToCatalogListing(dto),
          quantity: 1
        }))
      } else {
        // Load local cart for guest
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
      }
      hasLoaded.value = true
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Unable to load cart'
    } finally {
      isLoading.value = false
    }
  }

  // Load the cart from localStorage/API on client side
  if (import.meta.client) {
    void loadCart()
  }

  // Watch for auth changes to reload/sync or clear cart
  watch(
    () => usersStore.isAuthenticated,
    async () => {
      // Force reload on auth state change
      hasLoaded.value = false
      await loadCart(true)
    }
  )

  const addToCart = async (listing: CatalogListing) => {
    const existing = items.value.find(item => item.listing.id === listing.id)
    if (existing) {
      return
    }

    if (usersStore.isAuthenticated) {
      isLoading.value = true
      error.value = null
      try {
        await cartService.addToCart({ advertId: Number(listing.id) })
        items.value.push({ listing, quantity: 1 })
      } catch (cause) {
        error.value = cause instanceof Error ? cause.message : 'Unable to add to cart'
        throw cause
      } finally {
        isLoading.value = false
      }
    } else {
      items.value.push({ listing, quantity: 1 })
      saveCart()
    }
  }

  const removeFromCart = async (listingId: string) => {
    if (usersStore.isAuthenticated) {
      isLoading.value = true
      error.value = null
      try {
        await cartService.removeFromCart(Number(listingId))
        items.value = items.value.filter(item => item.listing.id !== listingId)
      } catch (cause) {
        error.value = cause instanceof Error ? cause.message : 'Unable to remove from cart'
        throw cause
      } finally {
        isLoading.value = false
      }
    } else {
      items.value = items.value.filter(item => item.listing.id !== listingId)
      saveCart()
    }
  }

  const updateQuantity = async (listingId: string, quantity: number) => {
    // Keep it local as quantity is capped at 1 for EcoScolar marketplace items anyway
    const existing = items.value.find(item => item.listing.id === listingId)
    if (existing) {
      if (quantity <= 0) {
        await removeFromCart(listingId)
      } else {
        existing.quantity = quantity
        if (!usersStore.isAuthenticated) {
          saveCart()
        }
      }
    }
  }

  const clearCart = async () => {
    if (usersStore.isAuthenticated) {
      isLoading.value = true
      error.value = null
      try {
        // Delete items from backend sequentially
        for (const item of items.value) {
          try {
            await cartService.removeFromCart(Number(item.listing.id))
          } catch (e) {
            console.error('Failed to remove item on clearCart:', e)
          }
        }
        items.value = []
      } catch (cause) {
        error.value = cause instanceof Error ? cause.message : 'Unable to clear cart'
        throw cause
      } finally {
        isLoading.value = false
      }
    } else {
      items.value = []
      saveCart()
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
