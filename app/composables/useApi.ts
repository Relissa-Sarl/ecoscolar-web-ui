// Get base fetch options type from $fetch
type FetchParameters = Parameters<typeof $fetch>
type BaseFetchOptions = NonNullable<FetchParameters[1]>

// Custom options
type UseApiOptions = BaseFetchOptions & {
  skipAuth?: boolean
}

// $fetch wrapper
export const useApi = <T>(
  request: string,
  options?: UseApiOptions
) => {
  const config = useRuntimeConfig()
  // const authStore = useAuthStore() // TODO : After the JWT implementation
  const { skipAuth, ...fetchOptions } = options ?? {}

  return $fetch<T>(request, {
    baseURL: config.public.apiBase,
    credentials: 'include', // Include cookies in requests for authentication
    ...fetchOptions,

    async onRequest({ options }) {
      const headers = new Headers(options.headers)

      // Check JWT if it is enabled
      if (config.public.enableJwt && !skipAuth) {
        // TODO : After the JWT implementation
        /* const token = authStore.token
        if (token) {
          headers.set('Authorization', `Bearer ${token}`)
        } */
      }

      options.headers = headers
    },

    async onResponseError({ response }) {
      // Redirection if unauthorized only for authenticated flows
      if (response.status === 401 && config.public.enableJwt && !skipAuth) {
        // authStore.clearAuth()
        await navigateTo('/') // TODO : Change to login route
      }
    }
  })
}

export default useApi
