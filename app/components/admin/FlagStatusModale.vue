<script setup lang="ts">
import type { AbuseReportAdminResponse } from '~/types/report'
import { TicketStatus } from '~/utils/enum/TicketStatus'

const props = defineProps<{
  isOpen: boolean
  flag: AbuseReportAdminResponse | null
}>()

const emit = defineEmits(['close', 'update'])

const status = ref(props.flag?.status || TicketStatus.PENDING)

watch(() => props.flag, (newFlag) => {
  status.value = newFlag?.status || TicketStatus.PENDING
})

const save = () => {
  if (props.flag) {
    emit('update', { id: props.flag.id, status: status.value })
    emit('close')
  }
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center"
    role="dialog"
    aria-modal="true"
    aria-labelledby="status-modal-title"
  >
    <div
      class="absolute inset-0 bg-black/50"
      @click="$emit('close')"
    />
    <div class="fixed flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div class="p-6 border-b dark:border-gray-800 flex justify-between items-center">
          <h2
            id="status-modal-title"
            class="text-xl font-bold"
          >
            Change Flag Status
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
        <div class="p-6 space-y-6">
          <div v-if="flag">
            <label class="block text-sm font-bold text-gray-400 uppercase mb-2">Status</label>
            <select
              v-model="status"
              class="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-800 dark:bg-gray-950 outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option
                v-for="statusOption in Object.values(TicketStatus)"
                :key="statusOption"
                :value="statusOption"
              >
                {{ statusOption.toLocaleLowerCase().replace(/^\w/, (c: string) => c.toUpperCase()) }}
              </option>
            </select>
          </div>
          <div class="flex justify-end gap-3">
            <button
              class="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              @click="$emit('close')"
            >
              Cancel
            </button>
            <button
              class="px-4 py-2 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl transition-colors"
              :disabled="status === flag?.status"
              @click="save"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
