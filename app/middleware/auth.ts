import { useUsersStore } from '~/stores/usersStore'

export default defineNuxtRouteMiddleware(() => {
  const usersStore = useUsersStore()

  // If the user is not authenticated, we redirect them to the login page
  if (!usersStore.isAuthenticated)
    return navigateTo('/login')

  if (usersStore.user?.isBanned) {
    usersStore.logout()
    return navigateTo('/denied')
  }
})
