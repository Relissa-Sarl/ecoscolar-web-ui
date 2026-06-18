<script setup lang="ts">
import { computed, onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { navigateTo } from '#imports'
import CartEmpty from '~/components/cart/CartEmpty.vue'
import CartHeader from '~/components/cart/CartHeader.vue'
import CartSummary from '~/components/cart/CartSummary.vue'
import CartAdvertItems from '~/components/cart/CartAdvertItems.vue'
import { useCartStore } from '~/stores/cartStore'
import { getPaymentService } from '~/services/paymentService'
import { getAdvertService } from '~/services/advertService'

const { t } = useI18n()
const localePath = useLocalePath()

/**
 * Define the page metadata to specify that this page should only
 * be accessible to guests (unauthenticated users) by using the 'guest' middleware.
 */

useSeoMeta({
  title: () => t('cart.seo_title')
})

// Types
interface CartItem {
  id: number
  title: string
  category: 'book' | 'product' | 'service'
  categoryLabel: string
  price: number
  quantity: number
  author?: string
  seller: string
  imageUrl?: string
  shippingCost?: number
}

const cartStore = useCartStore()

onBeforeMount(async () => {
  await cartStore.loadCart(true)
})

const cartItems = computed<CartItem[]>(() => {
  return cartStore.items.map(item => ({
    id: Number(item.listing.id),
    title: item.listing.title,
    category: item.listing.categoryTab === 'textbooks' ? 'book' : (item.listing.categoryTab === 'supplies' ? 'product' : 'service'),
    categoryLabel: item.listing.categoryTab === 'textbooks' ? 'Livre' : (item.listing.categoryTab === 'supplies' ? 'Fourniture' : 'Tutorat'),
    price: item.listing.price,
    quantity: item.quantity,
    seller: item.listing.seller || 'Vendeur',
    imageUrl: item.listing.imageUrl,
    shippingCost: item.shippingCost
  }))
})

const removeItem = (id: number) => {
  void cartStore.removeFromCart(String(id))
}

const clearCart = () => {
  void cartStore.clearCart()
}

const shippingMethod = ref<'post' | 'handToHand'>('post')

// Calculations
const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const shippingCost = computed(() => {
  return shippingMethod.value === 'post' ? 2 : 0
})

const serviceFee = computed(() => {
  return subtotal.value * 0.1
})

const taxTva = computed(() => {
  return (subtotal.value + shippingCost.value + serviceFee.value) * 0.081
})

const total = computed(() => {
  return subtotal.value + shippingCost.value + serviceFee.value + taxTva.value
})

const itemsCount = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

const isCheckingOut = ref(false)
const checkoutError = ref<string | null>(null)

const usersStore = useUsersStore()

// handle checkout with stripe
const handleCheckout = async () => {
  // if cart is empty or checkout is already in progress, return
  if (cartItems.value.length === 0 || isCheckingOut.value) return

  if (!usersStore.isAuthenticated) {
    await navigateTo(localePath('/login'))
    return
  }

  if (usersStore.user?.isBanned) {
    await navigateTo(localePath('/banned'))
    return
  }

  // set checking out flag and clear any previous error
  isCheckingOut.value = true
  checkoutError.value = null

  // try to create a checkout session with stripe
  try {
    const paymentService = getPaymentService()
    const firstItem = cartItems.value[0]
    const response = await paymentService.createCheckoutSession({
      productId: firstItem ? Number(firstItem.id) : 0,
      productIds: cartItems.value.map(item => Number(item.id)),
      productPrice: total.value.toFixed(2)
    })
    // open stripe checkout page
    if (response && response.url) {
      sessionStorage.setItem('pending_checkout_ids', JSON.stringify(cartItems.value.map(item => Number(item.id))))
      await navigateTo(response.url, { external: true })
    } else {
      throw new Error('Url de session Stripe manquante dans la réponse de l\'API')
    }
  } catch (err) {
    console.error('Checkout error:', err)
    const errorObj = err as { data?: { code?: string, error?: unknown } }
    if (errorObj && typeof errorObj === 'object' && errorObj.data && typeof errorObj.data === 'object') {
      if (errorObj.data.code === 'ITEM_UNAVAILABLE') {
        checkoutError.value = t('checkout.errors.item_pending_or_sold')
      } else if (errorObj.data.error) {
        checkoutError.value = String(errorObj.data.error)
      } else {
        checkoutError.value = err instanceof Error ? err.message : t('checkout.errors.init_failed')
      }
    } else {
      checkoutError.value = err instanceof Error ? err.message : t('checkout.errors.init_failed')
    }
  } finally {
    isCheckingOut.value = false
  }
}

const checkAndResetPausedItems = async () => {
  const pendingJson = sessionStorage.getItem('pending_checkout_ids')
  if (pendingJson) {
    try {
      const ids: number[] = JSON.parse(pendingJson)
      if (Array.isArray(ids) && ids.length > 0) {
        const advertService = getAdvertService()
        for (const id of ids) {
          try {
            await advertService.updateAdvertStatus(id, 'ACTIVE')
          } catch (err) {
            console.error(`Failed to reset PAUSED status for advert ${id}:`, err)
          }
        }
        await cartStore.loadCart(true)
      }
    } catch (err) {
      console.error('Failed to parse pending_checkout_ids:', err)
    } finally {
      sessionStorage.removeItem('pending_checkout_ids')
    }
  }
}

const onPageShow = async (event: PageTransitionEvent) => {
  if (event.persisted) {
    await checkAndResetPausedItems()
  }
}

onMounted(async () => {
  const navigationEntries = window.performance?.getEntriesByType('navigation')
  const isBackNavigation = navigationEntries && navigationEntries.length > 0
    && (navigationEntries[0] as PerformanceNavigationTiming).type === 'back_forward'

  if (isBackNavigation) {
    await checkAndResetPausedItems()
  }

  window.addEventListener('pageshow', onPageShow)
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('pageshow', onPageShow)
  }
})
</script>

<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
    <div class="max-w-6xl mx-auto">
      <CartHeader
        :items-count="itemsCount"
        :has-items="cartItems.length > 0"
        @clear="clearCart"
      />

      <!-- Error Banner -->
      <div
        v-if="checkoutError"
        class="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/50 text-red-800 dark:text-red-300 text-sm flex items-center justify-between gap-3 animate-fade-in"
      >
        <div class="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>{{ checkoutError }}</span>
        </div>
        <button
          class="hover:text-red-950 dark:hover:text-red-100 transition-colors cursor-pointer"
          @click="checkoutError = null"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Main Layout -->
      <div
        v-if="cartItems.length > 0"
        class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in"
      >
        <!-- Left: Items list -->
        <CartAdvertItems
          :items="cartItems"
          @remove="removeItem"
        />

        <!-- Right: Summary & Order breakdown -->
        <CartSummary
          v-model="shippingMethod"
          :subtotal="subtotal"
          :shipping-cost="shippingCost"
          :service-fee="serviceFee"
          :total="total"
          :loading="isCheckingOut"
          @checkout="handleCheckout"
        />
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="text-center py-20 px-4 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm max-w-2xl mx-auto shadow-sm animate-fade-in"
      >
        <CartEmpty />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Transition lists */
.cart-list-enter-active,
.cart-list-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.cart-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.cart-list-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}
.cart-list-move {
  transition: transform 0.4s ease;
}
</style>
