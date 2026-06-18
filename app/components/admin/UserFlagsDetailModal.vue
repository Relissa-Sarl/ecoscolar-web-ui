<script lang="ts" setup>
import type { FlagAdminDto } from '~/types/user-report'

type FlagModalType = Omit<FlagAdminDto, 'createdAt'>

defineProps<{
  isOpen: boolean
  userNickname: string
  flags: FlagModalType[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
    @click.self="emit('close')"
  >
    <div class="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full p-6 border border-gray-200 dark:border-gray-800 shadow-xl max-h-[80vh] flex flex-col">
      <div class="flex justify-between items-center mb-4 shrink-0">
        <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">
          Reports for <span class="text-emerald-600">{{ userNickname }}</span>
        </h3>
        <button
          class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          @click="emit('close')"
        >
          <Icon
            name="material-symbols:close-rounded"
            class="size-6"
          />
        </button>
      </div>

      <div class="space-y-4 overflow-y-auto pr-1 flex-1">
        <div
          v-for="flag in flags"
          :key="flag.flagId"
          class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-800"
        >
          <div class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span><strong>ID:</strong> #{{ flag.flagId }}</span>
          </div>

          <span class="font-semibold uppercase tracking-wider bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 px-2 py-0.5 rounded text-xs">
            {{ flag.reason.replace(/_/g, ' ') }}
          </span>

          <div class="text-xs text-gray-400 border-t border-gray-200/60 dark:border-gray-700/60 pt-2 flex justify-between items-center mt-1">
            <span>
              Reported by: <strong class="text-gray-600 dark:text-gray-300">{{ flag.reporterNickname }}</strong>
            </span>
            <span class="text-gray-400 font-mono text-[11px]">{{ flag.reporterEmail }}</span>
          </div>
        </div>

        <div
          v-if="flags.length === 0"
          class="text-center py-6 text-gray-500"
        >
          No reports found.
        </div>
      </div>
    </div>
  </div>
</template>
