<script setup lang="ts">
import ErrorMessage from '~/components/common/messages/ErrorMessage.vue'
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
    <ErrorMessage
      v-if="displayError"
      :message="displayError"
    />

    <ProfileInfos
      v-else
      :user="user"
      :is-own-profile="false"
    />
  </div>
</template>
