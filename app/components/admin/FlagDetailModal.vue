<script setup lang="ts">
import type { AbuseReportResponse } from '~/types/report'

defineProps<{
  isOpen: boolean
  flag: AbuseReportResponse | null
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
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b dark:border-gray-800 flex justify-between items-center">
          <h2
            id="ticket-modal-title"
            class="text-xl font-bold"
          >
            Ticket Details
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
          <div class="space-y-4">
            <section>
              <h3 class="text-sm font-bold uppercase text-gray-400 mb-2">
                User Information
              </h3>
              <div
                v-if="flag"
                class="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl"
              >
                <p class="font-bold">
                  {{ flag.id }}
                </p>
                <p class="text-sm text-gray-500">
                  @{{ flag.message }}
                </p>
                <p class="text-sm mt-2">
                  {{ formatDate(flag.createdAt) }}
                </p>
                <p
                  class="text-xs mt-1 inline-block rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 dark:bg-blue-900/50 dark:text-blue-400"
                >
                  User ID: {{ flag.reporterUserId }}
                </p>
                <p
                  class="text-xs mt-1 inline-block rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 dark:bg-blue-900/50 dark:text-blue-400"
                >
                  Advert ID: {{ flag.targetAdvertId }}
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
