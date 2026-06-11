// Get base fetch options type from $fetch
type FetchParameters = Parameters<typeof $fetch>
type BaseFetchOptions = NonNullable<FetchParameters[1]>

// Custom options extending base fetch options
type UseApiOptions = BaseFetchOptions & {
  skipAuth?: boolean
}

// Custom $fetch wrapper resilient to Nuxt context loss during sequential async operations
export const useApi = <T>(
  request: string,
  options?: UseApiOptions
) => {
  // Default fallback values
  let apiBase = 'https://localhost:5001/api'
  let reqCookies: string | undefined = undefined

  try {
    // If Nuxt context is available, use dynamic runtime configuration
    const config = useRuntimeConfig()
    apiBase = config.public.apiBase || apiBase

    // Capture cookies during Server-Side Rendering (SSR) to maintain session
    if (import.meta.server) {
      reqCookies = useRequestHeaders(['cookie']).cookie
    }
  } catch {
    // Safe fallback to environment variables if Nuxt context is lost after an 'await' in SSR.
    // This prevents application crashes while completely avoiding global state memory leaks.
    apiBase = process.env.NUXT_PUBLIC_API_BASE || apiBase
  }

  const { skipAuth, ...fetchOptions } = options ?? {}

  return $fetch<T>(request, {
    baseURL: apiBase,
    credentials: 'include', // Include cookies in requests for authentication
    ...fetchOptions,

    async onRequest({ options }) {
      const headers = new Headers(options.headers)

      // Inject captured cookies safely if we are performing SSR
      if (import.meta.server && reqCookies) {
        headers.set('cookie', reqCookies)
      }
      options.headers = headers
    },

    async onResponseError({ response }) {
      // Redirect to login/home page if unauthorized on authenticated routes
      if (response.status === 401 && !skipAuth) {
        // Clear session indicator cookie if it exists
        if (typeof useCookie !== 'undefined') {
          const loggedInCookie = useCookie('ecoscolar_logged_in')
          loggedInCookie.value = null
        }

        try {
          await navigateTo('/')
        } catch {
          // Prevent crashes if the Nuxt context is lost during the redirection phase
        }
      }
    }
  })
}

export default useApi
