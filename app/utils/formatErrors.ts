import type ApiError from '~/types/apiError'

export default function formatErrors({ data }: ApiError): string[] {
  // if the API response contains validation errors,
  // extract the error keys to display user-friendly messages
  const errorKeys = Object.keys(data?.errors || {})
  return errorKeys.length > 0 ? errorKeys : ['Default']
}
