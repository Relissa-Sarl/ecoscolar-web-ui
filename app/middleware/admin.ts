// Admin route guard.
export default defineNuxtRouteMiddleware(() => {
  const usersStore = useUsersStore()

  if (!usersStore.isAdmin)
    return navigateTo('/')
})
