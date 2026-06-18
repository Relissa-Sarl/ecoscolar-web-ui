import { computed, ref } from 'vue'
import { useI18n, useToast, useAsyncData, useCookie } from '#imports'
import { getUserService } from '~/services/usersService'

export const usePublicUser = (userId: string) => {
  const { t } = useI18n()
  const toast = useToast()
  const usersService = getUserService()

  const isReporting = ref(false)
  const reportError = ref<string | null>(null)

  const reportedUsers = useCookie<string[]>('ecoscolar_reported_users', {
    default: () => [],
    maxAge: 60 * 60 * 24
  })

  // Fetch public profile and reviews in parallel
  const { data: user, pending: userPending, error: userError } = useAsyncData(
    `public-profile-${userId}`,
    () => usersService.getPublicProfile(userId)
  )

  const { data: reviews, pending: reviewsPending } = useAsyncData(
    `user-reviews-${userId}`,
    () => usersService.getReviews(userId)
  )

  const isLoading = computed(() => userPending.value || reviewsPending.value)

  const hasReportedUser = computed(() => {
    return reportedUsers.value?.includes(userId) || false
  })

  /**
   * Computed property to determine if there is an error in fetching the user profile.
   * If there's an error or no user after loading, it returns an error message.
   */
  const displayError = computed(() => {
    if (userError.value || (!userPending.value && !user.value)) {
      return t('profile.public.error')
    }
    return null
  })

  const reportUser = async (message: string) => {
    if (hasReportedUser.value && message.trim() === '') return

    isReporting.value = true
    reportError.value = null

    try {
      await usersService.report(userId, message)

      reportedUsers.value = [...(reportedUsers.value || []), userId]

      toast.add({
        title: t('report.success'),
        color: 'success'
      })
    } catch {
      reportError.value = t('report.error')
      toast.add({
        title: t('report.error'),
        color: 'error'
      })
    } finally {
      isReporting.value = false
    }
  }

  return {
    user,
    reviews,
    isLoading,
    displayError,
    isReporting,
    reportError,
    hasReportedUser,
    reportUser
  }
}
