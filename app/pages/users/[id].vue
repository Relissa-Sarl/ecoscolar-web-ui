<script setup lang="ts">
import { useRoute } from '#imports'
import { usePublicUser } from '~/composables/usePublicUser'
import ErrorMessage from '~/components/common/messages/ErrorMessage.vue'
import ProfileReviews from '~/components/profile/ProfileReviews.vue'
import ProfileInfos from '~/components/profile/ProfileInfos.vue'

const route = useRoute()
const userId = route.params.id as string

const {
  user,
  reviews,
  isLoading,
  displayError,
  reportUser
} = usePublicUser(userId)

const handleReport = async () => {
  await reportUser('Signalement depuis le profil public')
}
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
          @report-user="handleReport"
        />

        <!-- Right: Reviews Feed & Statistics -->
        <div class="flex-1 w-full">
          <ProfileReviews :reviews="reviews ?? []" />
        </div>
      </div>
    </div>
  </div>
</template>
