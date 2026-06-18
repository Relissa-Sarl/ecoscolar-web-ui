<script setup lang="ts">
import { computed } from 'vue'
import type { PublicUser, User } from '~/types/user'
import LanguagesComponent from './private/LanguagesComponent.vue'
import LocationComponent from './private/LocationComponent.vue'

const localePath = useLocalePath()

/**
 * Props definition for the ProfileInfos component.
 */
const props = defineProps<{
  user: User | PublicUser | null
  isOwnProfile: boolean
}>()

const emits = defineEmits<{
  'delete-account': []
  'report-user': []
}>()

/**
 * Computed property to generate a display name for the user.
 * If the profile belongs to the logged-in user and has first and last name, it combines them.
 * Otherwise, it falls back to the user's nickname or an empty string if no user is provided.
 */
const displayName = computed(() => {
  if (!props.user) return ''
  if (props.isOwnProfile && 'firstName' in props.user) {
    return `${props.user.firstName} ${props.user.lastName}`
  }
  return props.user.nickname || ''
})

const profileMenuLink = (path: string) => localePath({
  path,
  query: { from: 'profile' }
})
</script>

<template>
  <div class="w-full max-w-[320px] bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center shadow-sm">
    <div class="relative mb-4 mt-2">
      <img
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas&backgroundColor=2d3748"
        alt="User Avatar"
        class="w-24 h-24 rounded-full object-cover border-4 border-emerald-50 dark:border-slate-900"
      >
    </div>

    <h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-3">
      {{ displayName }}
    </h2>

    <button
      v-if="!props.isOwnProfile"
      type="button"
      class="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors bg-transparent border-0 p-0 cursor-pointer outline-none focus:ring-2 focus:ring-red-500 rounded mb-4"
      @click="emits('report-user')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        class="w-4 h-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a4.873 4.873 0 003.713-4.748V5.09a4.873 4.873 0 00-3.713-4.748l-3.114.732a9 9 0 01-6.086-.71l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
        />
      </svg>
      <span>{{ $t('profile.public.report') }}</span>
    </button>

    <hr
      v-if="props.isOwnProfile"
      class="w-full border-slate-100 dark:border-slate-800 mb-5"
    >

    <div
      v-if="props.isOwnProfile"
      class="w-full flex flex-col gap-3 mb-5 text-sm"
    >
      <LanguagesComponent
        :spoken-languages="(props.user as User)?.languages ?? []"
      />
      <LocationComponent
        :location="(props.user as User)?.location ?? null"
      />
    </div>

    <hr class="w-full border-slate-100 dark:border-slate-800 mb-5">

    <nav
      v-if="props.isOwnProfile"
      class="w-full flex flex-col gap-5"
    >
      <NuxtLink
        :to="profileMenuLink('/favorites')"
        class="flex items-center gap-3 text-emerald-950 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
        <span class="font-bold text-sm">{{ $t('profile.favorites') }}</span>
      </NuxtLink>

      <NuxtLink
        :to="profileMenuLink('/me/adverts')"
        class="flex items-center gap-3 text-emerald-950 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.999 2.999 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.999 2.999 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
          />
        </svg>
        <span class="font-bold text-sm">{{ $t('profile.sales') }}</span>
      </NuxtLink>

      <NuxtLink
        :to="profileMenuLink('/me/purchases')"
        class="flex items-center gap-3 text-emerald-950 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
        <span class="font-bold text-sm">{{ $t('profile.purchases_history') }}</span>
      </NuxtLink>

      <NuxtLink
        :to="profileMenuLink('/me/sales')"
        class="flex items-center gap-3 text-emerald-950 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span class="font-bold text-sm">{{ $t('profile.sales_history') }}</span>
      </NuxtLink>

      <NuxtLink
        v-if="props.isOwnProfile"
        :to="profileMenuLink('/me/support-requests')"
        class="flex items-center gap-3 text-emerald-950 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.625m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12.75m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
          />
        </svg>
        <span class="font-bold text-sm">{{ $t('profile.support_requests') }}</span>
      </NuxtLink>

      <NuxtLink
        v-if="props.isOwnProfile && (props.user as User)?.roles.includes('Admin')"
        :to="localePath('/me/admin')"
        class="flex items-center gap-3 text-emerald-950 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-6"
        >
          <path
            fill-rule="evenodd"
            d="M11.484 2.17a.75.75 0 0 1 1.032 0 11.209 11.209 0 0 0 7.877 3.08.75.75 0 0 1 .722.515 12.74 12.74 0 0 1 .635 3.985c0 5.942-4.064 10.933-9.563 12.348a.749.749 0 0 1-.374 0C6.314 20.683 2.25 15.692 2.25 9.75c0-1.39.223-2.73.635-3.985a.75.75 0 0 1 .722-.516l.143.001c2.996 0 5.718-1.17 7.734-3.08ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75ZM12 15a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75H12Z"
            clip-rule="evenodd"
          />
        </svg>

        <span class="font-bold text-sm">Dashboard</span>
      </NuxtLink>
      <NuxtLink
        :to="profileMenuLink('/me/settings')"
        class="flex items-center gap-3 text-emerald-950 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors ml-auto"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M 18.414062 2 C 18.158062 2 17.902031 2.0979687 17.707031 2.2929688 L 15.707031 4.2929688 L 14.292969 5.7070312 L 3 17 L 3 21 L 7 21 L 21.707031 6.2929688 C 22.098031 5.9019687 22.098031 5.2689063 21.707031 4.8789062 L 19.121094 2.2929688 C 18.926094 2.0979687 18.670063 2 18.414062 2 z M 18.414062 4.4140625 L 19.585938 5.5859375 L 18.292969 6.8789062 L 17.121094 5.7070312 L 18.414062 4.4140625 z M 15.707031 7.1210938 L 16.878906 8.2929688 L 6.171875 19 L 5 19 L 5 17.828125 L 15.707031 7.1210938 z"
          />
        </svg>
        <span class="font-bold text-sm">{{ $t('profile.edit') }}</span>
      </NuxtLink>
      <button
        v-if="props.isOwnProfile"
        class="flex items-center gap-3 text-red-500 hover:text-red-700 transition-colors ml-auto cursor-pointer"
        @click="() => emits('delete-account')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        <span class="font-bold text-sm">{{ $t('profile.delete') }}</span>
      </button>
    </nav>
  </div>
</template>
