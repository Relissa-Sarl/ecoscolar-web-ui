import { useUsersStore } from '~/stores/usersStore'

export default defineNuxtRouteMiddleware(() => {
  const usersStore = useUsersStore()

  // If the user is already authenticated, we redirect them to the home page
  if (usersStore.isAuthenticated)
    return navigateTo('/')
})
