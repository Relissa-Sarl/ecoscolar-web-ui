import { computed } from 'vue'

const useFormErrors = (errorsRef: () => string[] | null | undefined, translationPrefix: string = 'errors') => {
  const { t } = useI18n()

  /**
   * Computed property that transforms raw error keys from the API into user-friendly messages
   * using the translation function.
   */
  const displayErrors = computed(() => {
    const errors = errorsRef()
    if (!errors || errors.length === 0) return []

    return errors.map(errorKey => t(`${translationPrefix}.${errorKey}`))
  })

  return {
    displayErrors
  }
}

export default useFormErrors
