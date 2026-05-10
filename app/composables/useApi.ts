// Get base fetch options type from $fetch
type FetchParameters = Parameters<typeof $fetch>
type BaseFetchOptions = NonNullable<FetchParameters[1]>

// Custom options
type UseApiOptions = BaseFetchOptions & {
  skipAuth?: boolean
}

// $fetch wrapper
export const useApi = async <T>(
  request: string,
  options?: UseApiOptions
) => {
  const config = useRuntimeConfig()
  // const authStore = useAuthStore() // TODO : After the JWT implementation
  const { skipAuth, ...fetchOptions } = options ?? {}

  return $fetch<T>(request, {
    baseURL: config.public.apiBase as string,
    ...fetchOptions,

    async onRequest({ options }) {
      const headers = new Headers(options.headers)

      // Check JWT if it is enabled
      const jwtEnabled = config.public.enableJwt as boolean
      if (jwtEnabled && !skipAuth) {
        // TODO : After the JWT implementation
        /* const token = authStore.token
        if (token) {
          headers.set('Authorization', `Bearer ${token}`)
        } */
      }

      options.headers = headers
    },

    async onResponseError({ response }) {
      // Redirection if unauthorized
      if (response.status === 401) {
        // authStore.clearAuth()
        await navigateTo('/') // TODO : Change to login route
      }
    }
  })
}

export default useApi
