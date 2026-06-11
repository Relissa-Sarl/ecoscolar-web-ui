<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useAsyncData } from '#imports'
import ErrorMessage from '~/components/common/messages/ErrorMessage.vue'
import ProfileReviews from '~/components/profile/ProfileReviews.vue'
import { getUserService } from '~/services/usersService'

const route = useRoute()
const usersService = getUserService()

const userId = route.params.id as string

// Fetch public profile and reviews in parallel
const { data: user, pending: userPending, error: userError } = await useAsyncData(
  `public-profile-${userId}`,
  () => usersService.getPublicProfile(userId)
)

const { data: reviews, pending: reviewsPending } = await useAsyncData(
  `user-reviews-${userId}`,
  () => usersService.getReviews(userId)
)

const isLoading = computed(() => userPending.value || reviewsPending.value)

/**
 * Computed property to determine if there is an error in fetching the user profile.
 * If the user is null or there's an error, it returns an error message.
 */
const displayError = computed(() => {
  if (userError.value || (!userPending.value && !user.value)) {
    return $t('profile.public.error')
  }
  return null
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-gray-950 py-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <ErrorMessage
        v-if="displayError"
        :message="displayError"
      />

      <div
        v-else-if="isLoading"
        class="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600 mb-4" />
        <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">
          {{ $t('catalog.banner.loading') }}
        </p>
      </div>

      <div
        v-else
        class="flex flex-col lg:flex-row gap-8 items-start"
      >
        <!-- Left: Profile Info Sidebar -->
        <ProfileInfos
          :user="user ?? null"
          :is-own-profile="false"
          class="w-full lg:w-[320px] shrink-0"
        />

        <!-- Right: Reviews Feed & Statistics -->
        <div class="flex-1 w-full">
          <ProfileReviews :reviews="reviews ?? []" />
        </div>
      </div>
    </div>
  </div>
</template>
