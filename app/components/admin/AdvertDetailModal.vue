<script lang="ts" setup>
import type { MySaleAdvert } from '~/services/historyService'

defineProps<{
  isOpen: boolean
  advert: MySaleAdvert
  isSending: boolean
}>()

defineEmits(['close'])

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <div
      class="absolute inset-0 bg-black/50"
      @click="$emit('close')"
    />
    <div
      v-if="isOpen"
      class="fixed flex items-center justify-center p-4"
    >
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b dark:border-gray-800 flex justify-between items-center">
          <h2 class="text-xl font-bold">
            Advert Details
          </h2>
          <button
            class="text-gray-500 hover:text-black dark:hover:text-white"
            @click="$emit('close')"
          >
            ✕
          </button>
        </div>

        <div class="p-6">
          <div class="space-y-4">
            <section>
              <h3 class="text-sm font-bold uppercase text-gray-400 mb-2">
                Advert Information
              </h3>
              <div
                class="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl grid gap-2 grid-cols-2"
              >
                <p class="text-xl font-bold col-span-2">
                  {{ advert?.title }}
                </p>
                <div>
                  <p class="font-bold">
                    Publication Date:
                  </p>
                  <p class="text-sm">
                    {{ formatDate(advert?.publicationDate) }}
                  </p>
                </div>
                <div>
                  <p class="font-bold">
                    Notification Date:
                  </p>
                  <p class="text-sm">
                    {{ formatDate(advert?.notificationDate) || "No notification date" }}
                  </p>
                </div>
                <div class="">
                  <p class="font-bold">
                    Status:
                  </p>
                  <p class="text-sm">
                    {{ advert?.status.toLocaleLowerCase().replace(/^\w/, c => c.toUpperCase()) }}
                  </p>
                </div>
                <div class="">
                  <p class="font-bold">
                    Type:
                  </p>
                  <p class="text-sm">
                    {{ advert?.type.toLowerCase().replace(/^\w/, c => c.toUpperCase()) }}
                  </p>
                </div>
                <div>
                  <p
                    class="text-xs mt-1 inline-block rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 dark:bg-blue-900/50 dark:text-blue-400"
                  >
                    Advert ID: {{ advert?.id }}
                  </p>
                </div>
                <div>
                  <p
                    class="text-xs mt-1 inline-block rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 dark:bg-blue-900/50 dark:text-blue-400"
                  >
                    Seller ID: {{ advert?.userId }}
                  </p>
                </div>
                <img
                  v-if="advert?.primaryImage"
                  :src="advert.primaryImage"
                  alt="Advert Image"
                  class="col-span-2 w-full h-auto rounded-lg mt-4 object-cover"
                >
              </div>
            </section>

            <section>
              <h3 class="text-sm font-bold uppercase text-gray-400 mb-2">
                Transaction Details
              </h3>
              <div
                class="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl grid gap-2 grid-cols-2"
              >
                <p class="font-bold">
                  Seller: <span class="text-sm text-gray-500">{{ advert?.sellerPseudo }}</span>
                </p>
                <p
                  v-if="advert?.buyerName"
                  class="font-bold"
                >
                  Buyer: <span class="text-sm text-gray-500">{{ advert?.buyerName }}</span>
                </p>
                <p
                  v-else
                  class="font-bold"
                >
                  Buyer: <span class="text-sm text-gray-500">No buyer yet</span>
                </p>
                <p class="font-bold col-span-2">
                  Price: <span class="text-sm text-gray-500">{{ advert?.price }}</span>
                  <span
                    v-if="advert?.type === 'SERVICE'"
                    class="text-sm font-light"
                  > CHF/H
                  </span>
                  <span
                    v-else
                    class="text-sm font-light"
                  > CHF</span>
                </p>
              </div>
            </section>
            <section v-if="advert?.review">
              <h3 class="text-sm font-bold uppercase text-gray-400 mb-2">
                Review
              </h3>
              <div
                class="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl grid gap-2 grid-cols-2"
              >
                <p class="font-bold col-span-2">
                  Rating: <span class="text-sm text-gray-500">{{ advert?.review.rating }}</span>
                </p>
                <p class="font-bold col-span-2">
                  Comment: <span class="text-sm text-gray-500">{{ advert?.review.comment || "No comment" }}</span>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
