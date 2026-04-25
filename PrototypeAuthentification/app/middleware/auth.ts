// ---cut---
export default defineNuxtRouteMiddleware((to, from) => {
    const cookie = useCookie("authToken");
    // isAuthenticated() is an example method verifying if a user is authenticated
    if (!cookie.value || cookie.value === "") {
        return navigateTo('/login')
    }
})
