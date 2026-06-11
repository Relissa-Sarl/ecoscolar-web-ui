<script lang="ts" setup>
import SupportTicketChatAdmin from '~/components/admin/SupportTicketChatAdmin.vue'
import type { SupportTicketAdminDetail, SupportTicketMessage } from '~/types/support'

defineProps<{
  isOpen: boolean
  ticket: SupportTicketAdminDetail
  messages: SupportTicketMessage[]
  isSending: boolean
}>()

defineEmits(['close', 'send'])
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
            Ticket Details
          </h2>
          <button
            class="text-gray-500 hover:text-black dark:hover:text-white"
            @click="$emit('close')"
          >
            <Icon
              name="material-symbols:close"
              class="w-6 h-6"
            />
          </button>
        </div>

        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-4">
            <section>
              <h3 class="text-sm font-bold uppercase text-gray-400 mb-2">
                User Information
              </h3>
              <div
                v-if="ticket?.user.email"
                class="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl"
              >
                <p class="font-bold">
                  {{ ticket?.user.firstName }} {{ ticket?.user.lastName }}
                </p>
                <p class="text-sm text-gray-500">
                  @{{ ticket?.user.nickname }}
                </p>
                <p class="text-sm mt-2">
                  {{ ticket?.user.email }}
                </p>
                <p
                  class="text-xs mt-1 inline-block rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 dark:bg-blue-900/50 dark:text-blue-400"
                >
                  User ID: {{ ticket?.userId }}
                </p>
              </div>
              <div
                v-else
                class="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl"
              >
                <p class="text-sm text-gray-500">
                  {{ ticket?.email }}
                </p>
              </div>
            </section>

            <section>
              <h3 class="text-sm font-bold uppercase text-gray-400 mb-2">
                Ticket Summary
              </h3>
              <p class="text-sm font-medium">
                Subject: {{ ticket?.subject }}
              </p>
              <p class="text-sm text-gray-600 mt-2 p-3 bg-blue-50 rounded-lg dark:bg-gray-800">
                {{ ticket?.message }}
              </p>
            </section>
          </div>

          <div>
            <h3 class="text-sm font-bold uppercase text-gray-400 mb-2">
              Conversation
            </h3>
            <SupportTicketChatAdmin
              :ticket="ticket"
              :messages="messages"
              :sending="isSending"
              :reply-enabled="true"
              :email="ticket.email"
              @send="(msg) => $emit('send', msg)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
