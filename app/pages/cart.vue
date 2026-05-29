<script setup lang="ts">
import { ref, computed } from 'vue'
import CartEmpty from '~/components/cart/CartEmpty.vue'
import CartHeader from '~/components/cart/CartHeader.vue'
import CartSummary from '~/components/cart/CartSummary.vue'
import CartAdvertItems from '~/components/cart/CartAdvertItems.vue'

const { t } = useI18n()

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
}

// Initial Mock Items
const cartItems = ref<CartItem[]>([
  {
    id: 1,
    title: 'Mathématiques Analyse - Terminale S',
    category: 'book',
    categoryLabel: 'Livre',
    price: 18.50,
    quantity: 1,
    author: 'J. Martin & L. Dubois',
    seller: 'Marie L.'
  },
  {
    id: 2,
    title: 'Lot de 5 cahiers A4 Oxford - Petits carreaux',
    category: 'product',
    categoryLabel: 'Fourniture',
    price: 6.90,
    quantity: 1,
    seller: 'Thomas B.'
  },
  {
    id: 3,
    title: 'Soutien scolaire en Allemand (Niveau Collège)',
    category: 'service',
    categoryLabel: 'Tutorat',
    price: 30.00,
    quantity: 1,
    seller: 'Sophie V. (Répétitrice certifiée)'
  }
])

const removeItem = (id: number) => {
  cartItems.value = cartItems.value.filter(i => i.id !== id)
}

const clearCart = () => {
  cartItems.value = []
}

// Calculations
const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const shippingCost = computed(() => 0)

const serviceFee = computed(() => subtotal.value * 0.1)

const total = computed(() => {
  return subtotal.value + shippingCost.value + serviceFee.value
})

const itemsCount = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
})
</script>

<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <CartHeader
        :items-count="itemsCount"
        :has-items="cartItems.length > 0"
        @clear="clearCart"
      />

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
          :subtotal="subtotal"
          :service-fee="serviceFee"
          :shipping-cost="shippingCost"
          :total="total"
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
