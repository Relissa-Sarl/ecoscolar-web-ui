<script setup lang="ts">
import type { User } from '~/types/user'

defineProps<{ isOpen: boolean, user: User | null }>()
defineEmits(['close'])
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex justify-end"
  >
    <div
      class="absolute inset-0 bg-black/50"
      @click="$emit('close')"
    />

    <div class="relative w-full max-w-md bg-white dark:bg-gray-950 h-full p-8 shadow-xl overflow-y-auto border-l dark:border-gray-800">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-xl font-bold">
          User Details
        </h2>
        <button
          class="text-gray-400 hover:text-gray-600"
          @click="$emit('close')"
        >
          ✕
        </button>
      </div>

      <div
        v-if="user"
        class="space-y-8"
      >
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-800">
            {{ user.firstName?.charAt(0) }}{{ user.lastName?.charAt(0) }}
          </div>
          <div>
            <h3 class="font-bold text-lg">
              {{ user.firstName }} {{ user.lastName }}
            </h3>
            <p class="text-gray-500 text-sm">
              @{{ user.nickname }}
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-gray-500 text-xs uppercase">
                Email
              </p><p class="text-sm">
                {{ user.email }}
              </p>
            </div>
            <div>
              <p class="text-gray-500 text-xs uppercase">
                Birthday
              </p><p class="text-sm">
                {{ user.birthdayDate }}
              </p>
            </div>
          </div>

          <div v-if="user.location">
            <p class="text-gray-500 text-xs uppercase">
              Location
            </p>
            <p class="text-sm">
              {{ user.location.postalCode }} {{ user.location.city }}, {{ user.location.region }}
            </p>
          </div>
        </div>

        <div>
          <p class="text-gray-500 text-xs uppercase mb-2">
            Languages
          </p>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="lang in user.languages"
              :key="lang.label"
              class="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs"
            >
              <span class="font-bold">{{ lang.label.toUpperCase() }}</span>
              <span class="ml-1 text-gray-500">{{ lang.languageLevel }}</span>
            </div>
          </div>
        </div>

        <div>
          <p class="text-gray-500 text-xs uppercase mb-2">
            Roles
          </p>
          <div class="flex gap-2">
            <span
              v-for="role in user.roles"
              :key="role"
              class="px-2 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 rounded text-xs font-medium"
            >
              {{ role }}
            </span>
          </div>
        </div>
        <div>
          <p class="text-gray-500 text-xs uppercase mb-2">
            Status
          </p>
          <span
            class="inline-flex items-center gap-1.5 text-xs font-medium"
            :class="user.isBanned ? 'text-red-600' : 'text-emerald-600'"
          >
            <span :class="['w-2 h-2 rounded-full', user.isBanned ? 'bg-red-500' : 'bg-emerald-500']" />
            {{ user.isBanned ? 'Banned' : (user.isOnboarded ? 'Active' : 'Pending') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
