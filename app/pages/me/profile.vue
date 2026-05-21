<script setup lang="ts">
const usersStore = useUsersStore()

definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <ProfileInfos
    :user="usersStore.user"
    :is-own-profile="true"
  />
</template>
