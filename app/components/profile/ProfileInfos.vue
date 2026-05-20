<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PublicUser, SpokenLanguage, User } from '~/types/user'

const { t } = useI18n()

/**
 * Props definition for the ProfileInfos component.
 */
const props = defineProps<{
  user: User | PublicUser | null
  isOwnProfile: boolean
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

/**
 * Computed property to generate a display string of the user's spoken languages.
 * It maps the user's spoken languages to their localized names using the i18n translation function and joins them into a comma-separated string.
 */
const languagesDisplay = computed(() => {
  if (!props.isOwnProfile)
    return ''

  const langs = (props.user as User)?.spokenLanguages ?? []
  return langs
    .map((l: SpokenLanguage) => t(`languages.${l.language.toLowerCase()}`))
    .filter(Boolean)
    .join(', ')
})
</script>

<template>
  <div class="w-full max-w-[320px] bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center shadow-sm">
    <div class="relative mb-4 mt-2">
      <img
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Julian&backgroundColor=2d3748"
        alt="Julian Sterling"
        class="w-24 h-24 rounded-full object-cover border-4 border-emerald-50 dark:border-slate-900"
      >
      <div
        class="absolute bottom-0 right-0 bg-emerald-600 rounded-full p-1 border-2 border-white dark:border-slate-950 flex items-center justify-center text-white"
        title="Verified"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="w-4 h-4"
        >
          <path
            fill-rule="evenodd"
            d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>

    <h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-3">
      {{ displayName }}
    </h2>

    <div class="flex items-center gap-1 mb-6">
      <div class="flex items-center text-yellow-400">
        <svg
          v-for="i in 5"
          :key="i"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-5 h-5"
        >
          <path
            fill-rule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <span class="text-sm font-medium text-slate-700 dark:text-slate-300 ml-2">4.8 (124)</span>
    </div>

    <hr class="w-full border-slate-100 dark:border-slate-800 mb-5">

    <div class="w-full flex flex-col gap-3 mb-5 text-sm">
      <div class="flex justify-between items-center">
        <span class="text-slate-500 dark:text-slate-400">{{ $t('profile.language') }}</span>
        <span class="flex items-center gap-1.5 font-semibold text-emerald-900 dark:text-emerald-400">
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
              d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
            />
          </svg>
          <span>{{ languagesDisplay }}</span>
        </span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-slate-500 dark:text-slate-400">{{ $t('profile.location') }}</span>
        <span class="font-semibold text-slate-800 dark:text-slate-200">San Francisco, CA</span>
      </div>
    </div>

    <hr class="w-full border-slate-100 dark:border-slate-800 mb-5">

    <nav class="w-full flex flex-col gap-5">
      <NuxtLink
        to="/alerts"
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
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
        <span class="font-bold text-sm">{{ $t('profile.alerts') }}</span>
      </NuxtLink>

      <NuxtLink
        to="/favorites"
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
        to="/sales"
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
    </nav>
  </div>
</template>
