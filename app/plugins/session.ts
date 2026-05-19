import { useUsersStore } from '~/stores/usersStore'

export default defineNuxtPlugin(async () => {
  const usersStore = useUsersStore()
  await usersStore.fetchProfile()
})
