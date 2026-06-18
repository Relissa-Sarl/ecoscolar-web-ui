<script setup lang="ts">
import type { AbuseReportAdminResponse } from '~/types/report'

defineProps<{
  isOpen: boolean
  flag: AbuseReportAdminResponse | null
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
    role="dialog"
    aria-modal="true"
    aria-labelledby="ticket-modal-title"
  >
    <div
      class="absolute inset-0 bg-black/50"
      @click="$emit('close')"
    />
    <div
      v-if="isOpen"
      class="fixed flex items-center justify-center p-4"
    >
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full min-w-xl max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b dark:border-gray-800 flex justify-between items-center">
          <h2
            id="ticket-modal-title"
            class="text-xl font-bold"
          >
            Flag Details
          </h2>
          <button
            class="text-gray-500 hover:text-black dark:hover:text-white"
            aria-label="Fermer"
            @click="$emit('close')"
          >
            <Icon
              name="material-symbols:close"
              class="w-6 h-6"
            />
          </button>
        </div>
        <div class="p-6">
          <div
            v-if="flag"
            class="space-y-4"
          >
            <section>
              <h3 class="text-sm font-bold uppercase text-gray-400 mb-2">
                Flag Information
              </h3>
              <div
                class="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl grid gap-2 grid-cols-2"
              >
                <p class="text-xl font-bold col-span-2">
                  Flag #{{ flag.id }}:
                </p>

                <div class="col-span-2 gap-2">
                  <p class="font-bold">
                    {{ flag.reason.toLocaleLowerCase().replace(/^\w/, c => c.toUpperCase()).replace(/_/g, ' ') }}
                  </p>
                  <p class="text-sm">
                    {{ flag.message }}
                  </p>
                </div>
                <div>
                  <p class="font-bold">
                    Notification Date:
                  </p>
                  <p class="text-sm">
                    {{ formatDate(flag.createdAt) }}
                  </p>
                </div>
                <div>
                  <p class="font-bold">
                    Status:
                  </p>
                  <p class="text-sm">
                    {{ flag.status.toLocaleLowerCase().replace(/^\w/, c => c.toUpperCase()) }}
                  </p>
                </div>

                <p class="text-xl font-bold col-span-2 mt-4">
                  Reporter:
                </p>
                <div class="col-span-2">
                  <p
                    class="text-xs inline-block rounded-full mr-3 bg-blue-100 text-blue-800 px-2 py-0.5 dark:bg-blue-900/50 dark:text-blue-400"
                  >
                    ID: {{ flag.reporterUserId }}
                  </p>
                </div>
                <div>
                  <p class="font-bold">
                    Nickname:
                  </p>
                  <p class="text-sm">
                    {{ flag.reporterNickname }}
                  </p>
                </div>
                <div>
                  <p class="font-bold">
                    Email:
                  </p>
                  <p class="text-sm">
                    {{ flag.reporterEmail }}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 class="text-sm font-bold uppercase text-gray-400 mb-2">
                Advert Details
              </h3>
              <div
                class="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl grid gap-2 grid-cols-2"
              >
                <p class="text-xl font-bold col-span-2">
                  Advert #{{ flag.targetAdvertId }}:
                </p>
                <div>
                  <p class="font-bold">
                    Title:
                  </p>
                  <p class="text-sm">
                    {{ flag.advertTitle }}
                  </p>
                </div>
                <div>
                  <p class="font-bold">
                    Price:
                  </p>
                  <p class="text-sm">
                    {{ formatPrice(flag.advertPrice) }}
                  </p>
                </div>
                <div class="col-span-2 gap-2">
                  <p class="font-bold">
                    Description:
                  </p>
                  <p class="text-sm">
                    {{ flag.advertDescription }}
                  </p>
                </div>

                <p class="text-xl font-bold col-span-2 mt-4">
                  Seller:
                </p>
                <div class="col-span-2">
                  <p
                    class="text-xs inline-block rounded-full mr-3 bg-blue-100 text-blue-800 px-2 py-0.5 dark:bg-blue-900/50 dark:text-blue-400"
                  >
                    ID: {{ flag.sellerId }}
                  </p>
                </div>
                <div>
                  <p class="font-bold">
                    Nickname:
                  </p>
                  <p class="text-sm">
                    {{ flag.sellerNickname }}
                  </p>
                </div>
                <div>
                  <p class="font-bold">
                    Email:
                  </p>
                  <p class="text-sm">
                    {{ flag.sellerEmail }}
                  </p>
                </div>
              </div>
            </section>

            <section v-if="flag.targetCommentId">
              <h3 class="text-sm font-bold uppercase text-gray-400 mb-2">
                Comment Details
              </h3>
              <div
                class="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl grid gap-2"
              >
                <p class="text-xl font-bold col-span-2">
                  Comment #{{ flag.targetCommentId }}:
                </p>
                <div>
                  <p class="font-bold">
                    Content:
                  </p>
                  <p class="text-sm">
                    {{ flag.commentContent }}
                  </p>
                </div>
                <div v-if="flag.commentAnswer">
                  <p class="font-bold">
                    Answer:
                  </p>
                  <p class="text-sm">
                    {{ flag.commentAnswer }}
                  </p>
                </div>

                <p class="text-xl font-bold col-span-2 mt-4">
                  Author:
                </p>
                <div class="col-span-2">
                  <p
                    class="text-xs inline-block rounded-full mr-3 bg-blue-100 text-blue-800 px-2 py-0.5 dark:bg-blue-900/50 dark:text-blue-400"
                  >
                    ID: {{ flag.authorId }}
                  </p>
                </div>
                <div>
                  <p class="font-bold">
                    Nickname:
                  </p>
                  <p class="text-sm">
                    {{ flag.authorNickname }}
                  </p>
                </div>
                <div>
                  <p class="font-bold">
                    Email:
                  </p>
                  <p class="text-sm">
                    {{ flag.authorEmail }}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
