import { computed } from 'vue'

const useFormErrors = <K extends string = string>(
  errorsRef: () => string[] | null | undefined,
  translationPrefix: string = 'errors'
) => {
  const { t } = useI18n()

  /**
   * A reactive set to track which error keys have been accessed for display.
   * This allows us to differentiate between errors that have been displayed
   * in the UI and those that have not, enabling features like showing a
   * summary of remaining errors or conditionally rendering error containers
   * based on whether there are any errors left to display.
   */
  const handledKeys = reactive(new Set<string>())

  /**
   * Translate raw error keys into user-friendly messages using the i18n system.
   * The translation keys are constructed by combining the provided translationPrefix with the raw error keys.
   * For example, if translationPrefix is 'reset_password.errors' and a raw error key is 'PasswordTooShort',
   * the resulting translation key would be 'reset_password.errors.PasswordTooShort'.
   * This allows for organized and contextual error messages in the UI.
   */
  const translatedErrors = computed<Record<K, string>>(() => {
    // Get the raw error keys from the provided errorsRef function
    const rawErrors = errorsRef()

    // If there are no errors, clear handled keys and return an empty object
    if (!rawErrors || rawErrors.length === 0) {
      handledKeys.clear()
      return {} as Record<string, string>
    }

    // Translate raw error keys into user-friendly messages using the i18n system
    return rawErrors.reduce((acc, errorKey) => {
      acc[errorKey] = t(`${translationPrefix}.${errorKey}`)
      return acc
    }, {} as Record<string, string>)
  })

  /**
   * Transforms raw error keys into a strongly-typed reactive dictionary.
   * Keys are restricted to the provided TErrorKeys generic parameter.
   */
  const errors = computed(() => {
    // Get the current translated errors
    const currentErrors = translatedErrors.value

    // If there are no errors, clear handled keys and return an empty object
    if (!currentErrors || Object.keys(currentErrors).length === 0)
      return {} as Partial<Record<K, string>>

    // Return a proxy to track which error keys have been accessed for display
    return new Proxy(currentErrors, {
      get(target, prop: K) {
        if (prop in target) {
          handledKeys.add(prop)
        }
        return target[prop]
      }
    })
  })

  /**
   * A computed array of error messages that have not been accessed for display yet.
   * This can be used to show a summary of remaining errors or to conditionally render
   * error containers if there are any errors left to display.
   */
  const globalErrors = computed<string[]>(() => {
    // Get the current translated errors
    const currentErrors = translatedErrors.value

    // If there are no errors, clear handled keys and return an empty array
    if (!currentErrors || Object.keys(currentErrors).length === 0)
      return []

    const tesst = Object.entries(currentErrors)
      .filter(([key]) => !handledKeys.has(key))
      .map(([, value]) => value as string)

    console.log(handledKeys)

    return tesst
  })

  /**
   * Indicates whether there are any errors to display, either handled or unhandled.
   * This can be used to conditionally render error containers in the UI.
   */
  const hasErrors = computed<boolean>(() => globalErrors.value.length > 0)

  return {
    errors,
    globalErrors,
    hasErrors
  }
}

export default useFormErrors
