<script setup lang="ts">
import { computed } from 'vue'

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
}

const props = defineProps<{
  items: CartItem[]
}>()

defineEmits<{
  (e: 'remove', id: number): void
}>()

const localePath = useLocalePath()

// Group items by seller
const groupedItems = computed(() => {
  const groups: Record<string, CartItem[]> = {}
  for (const item of props.items) {
    const seller = item.seller || 'Vendeur'
    if (!groups[seller]) {
      groups[seller] = []
    }
    groups[seller].push(item)
  }
  return groups
})
</script>

<template>
  <div class="lg:col-span-2">
    <TransitionGroup
      name="cart-list"
      tag="div"
      class="space-y-6"
    >
      <div
        v-for="(sellerItems, sellerName) in groupedItems"
        :key="sellerName"
        class="rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
      >
        <!-- Group Header / Seller Info -->
        <div class="flex items-center gap-2.5 px-5 py-4 bg-slate-50/75 dark:bg-slate-900/50 border-b border-slate-200/50 dark:border-slate-800/50">
          <div class="flex size-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {{ $t('cart.items.vendor') }} : <span class="text-emerald-800 dark:text-emerald-400 font-bold">{{ sellerName }}</span>
          </span>
        </div>

        <!-- Items in this group -->
        <TransitionGroup
          name="cart-list"
          tag="div"
          class="divide-y divide-slate-100 dark:divide-slate-800/50"
        >
          <div
            v-for="item in sellerItems"
            :key="item.id"
            class="relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 hover:bg-slate-50/30 dark:hover:bg-slate-900/30 transition-all duration-350 overflow-hidden group"
          >
            <!-- Card item info -->
            <div class="flex items-center gap-4 w-full sm:w-auto">
              <!-- Visual Icon / Image Cover placeholder with dynamic premium gradients based on category -->
              <NuxtLink
                :to="localePath(`/adverts/${item.id}`)"
                class="w-16 h-20 rounded-xl flex items-center justify-center shadow-inner flex-shrink-0 overflow-hidden hover:opacity-90 transition-opacity"
                :class="!item.imageUrl ? [
                  'text-white bg-gradient-to-br',
                  item.category === 'book' ? 'from-emerald-400 to-teal-650' : '',
                  item.category === 'product' ? 'from-blue-400 to-indigo-650' : '',
                  item.category === 'service' ? 'from-purple-400 to-pink-650' : ''
                ] : ''"
              >
                <img
                  v-if="item.imageUrl"
                  :src="item.imageUrl"
                  :alt="item.title"
                  class="w-full h-full object-cover"
                >
                <template v-else>
                  <!-- Custom SVG depending on category -->
                  <svg
                    v-if="item.category === 'book'"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-8 w-8 opacity-90"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <svg
                    v-else-if="item.category === 'product'"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-8 w-8 opacity-90"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-8 w-8 opacity-90"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </template>
              </NuxtLink>

              <!-- Text details -->
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-1.5">
                  <!-- Badges  -->
                  <span
                    :class="[
                      'px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase shadow-sm border',
                      item.category === 'book' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/30 dark:border-emerald-900/50' : '',
                      item.category === 'product' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200/30 dark:border-blue-900/50' : '',
                      item.category === 'service' ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200/30 dark:border-purple-900/50' : ''
                    ]"
                  >
                    {{ $t(item.category === 'book' ? 'cart.items.books' : item.category === 'product' ? 'cart.items.supplies' : 'cart.items.tutoring') }}
                  </span>
                  <span class="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200/10">
                    {{ $t('cart.items.quantity') }}: {{ item.quantity }}
                  </span>
                </div>
                <h3 class="text-base font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  <NuxtLink
                    :to="localePath(`/adverts/${item.id}`)"
                    class="hover:underline"
                  >
                    {{ item.title }}
                  </NuxtLink>
                </h3>

                <div
                  v-if="item.reservedUntil"
                  class="mt-2 inline-block"
                />
              </div>
            </div>

            <!-- Price and Trash -->
            <div class="mt-4 sm:mt-0 flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-3 sm:pt-0">
              <div class="flex items-center gap-4">
                <div class="text-right">
                  <span class="block text-base font-bold text-slate-800 dark:text-slate-100 min-w-[70px]">
                    {{ (item.price * item.quantity).toFixed(2) }} CHF
                  </span>
                </div>

                <button
                  class="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/40 cursor-pointer"
                  title="Supprimer l'article"
                  aria-label="Supprimer l'article"
                  @click="$emit('remove', item.id)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </TransitionGroup>
  </div>
</template>
