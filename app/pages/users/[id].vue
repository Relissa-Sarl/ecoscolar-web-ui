<script setup lang="ts">
import { getUserService } from '~/services/usersService'
import type { PublicUser } from '~/types/user'

const route = useRoute()
const usersService = getUserService()

const userId = route.params.id as string

const user = ref<PublicUser | null>(null)

onMounted(async () => {
  try {
    user.value = await usersService.getPublicProfile(userId)
  } catch (error) {
    console.error('Failed to fetch user profile:', error)
  }
})

/**
 * Computed property to determine if there is an error in fetching the user profile.
 * If the user is null, it returns an error message from the translation files.
 */
const displayError = computed(() => {
  if (user.value === null) {
    return $t('profile.public.error')
  }
  return null
})
</script>

<template>
  <div>
    <div
      v-if="displayError"
      class="w-full max-w-2xl mx-auto mt-8 px-4 text-center text-red-500"
    >
      {{ displayError }}
    </div>

    <ProfileInfos
      v-else
      :user="user"
      :is-own-profile="false"
    />
  </div>
</template>
