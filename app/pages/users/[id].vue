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
</script>

<template>
  <ProfileInfos
    :user="user"
    :is-own-profile="true"
  />
</template>
