import { useUsersStore } from '~/stores/usersStore'

export default defineNuxtRouteMiddleware((to) => {
  const usersStore = useUsersStore()

  const allowedRoutes = ['/register/step-2', '/', '/it', '/de', '/support', '/terms', '/privacy']

  // If the user is already on the onboarding page, we don't want to redirect them again
  if (allowedRoutes.includes(to.path)) {
    return
  }

  // If the user is authenticated but has not completed the onboarding process, we redirect them to the onboarding page
  if (usersStore.isAuthenticated && usersStore.user && !usersStore.user.isOnboarded)
    return navigateTo('/register/step-2')
})
