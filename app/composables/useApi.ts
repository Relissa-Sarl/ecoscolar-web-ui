import { useToast } from '#imports'

export const useApi = async <T>(
  request: Parameters<typeof $fetch>[0],
  opts?: Parameters<typeof $fetch>[1]
) => {
  const toast = useToast()
  const config = useRuntimeConfig()

  return $fetch<T>(request, {
    baseURL: config.public.apiBase as string,
    ...opts,

    async onRequest({ options }) {
      const headers = new Headers(options.headers)

      // TODO : Gestion du token JWT
      options.headers = headers
    },

    async onResponseError({ response }) {
      toast.add({
        title: 'Erreur',
        description: response.statusText,
        color: 'error'
      })
    }
  })
}

export default useApi
