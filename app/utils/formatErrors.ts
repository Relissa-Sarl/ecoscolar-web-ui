import type ApiError from '~/types/apiError'

export default function formatErrors({ data }: ApiError): string[] {
  // if the API response contains validation errors,
  // extract the error keys to display user-friendly messages
  const errors = data?.errors

  if (Array.isArray(errors))
    return errors

  const errorKeys = Object.keys(errors || {})
  return errorKeys.length > 0 ? errorKeys : ['Default']
}
