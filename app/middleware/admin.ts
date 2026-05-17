// Admin route guard.
// TODO: replace this stub with a real auth check once the auth store
// is implemented (see useApi.ts and the JWT TODO).
// Expected behavior:
//   - if the user is not authenticated -> redirect to /login
//   - if the user is authenticated but not an admin -> redirect to /
export default defineNuxtRouteMiddleware(() => {
  // No-op for now; admin pages do not exist yet.
})
