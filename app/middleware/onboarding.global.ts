import { useUsersStore } from '~/stores/usersStore'

export default defineNuxtRouteMiddleware((to) => {
  const usersStore = useUsersStore()
  const localePath = useLocalePath()

  const protectedPath = '/register/step-2'
  const allowedRoutes = ['/', '/register/step-2', '/support', '/me/support-requests', '/terms', '/privacy']
  const normalizedPath = to.path.replace(/^\/(it|de)(?=\/|$)/, '') || '/'

  if (normalizedPath === protectedPath) {
    if (!usersStore.isAuthenticated) {
      return navigateTo(localePath('/login'))
    }
    if (usersStore.user && usersStore.user.isOnboarded) {
      return navigateTo(localePath('/'))
    }
  }

  // If the user is already on an allowlisted page, we don't want to redirect them again
  if (allowedRoutes.includes(normalizedPath)) {
    return
  }

  // If the user is authenticated but has not completed the onboarding process, we redirect them to the onboarding page
  if (usersStore.isAuthenticated && usersStore.user && !usersStore.user.isOnboarded)
    return navigateTo(localePath(protectedPath))
})
