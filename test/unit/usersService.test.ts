import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createUserService } from '../../app/services/usersService'
import type { UserReview } from '../../app/types/user'

const mockReviews: UserReview[] = [
  {
    reviewId: 1,
    comment: 'Great buyer!',
    rating: 5,
    date: '2026-06-01T10:00:00Z',
    reviewerId: 'reviewer-1',
    reviewerNickname: 'Alice',
    reviewedId: 'user-123',
    reviewedNickname: 'Bob',
    transactionId: 101,
    reviewedRole: 'BUYER'
  },
  {
    reviewId: 2,
    comment: 'Polite and fast payment',
    rating: 4,
    date: '2026-06-02T14:30:00Z',
    reviewerId: 'reviewer-2',
    reviewerNickname: 'Charlie',
    reviewedId: 'user-123',
    reviewedNickname: 'Bob',
    transactionId: 102,
    reviewedRole: 'BUYER'
  }
]

describe('usersService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getReviews', () => {
    it('fetches reviews for a given user ID', async () => {
      const apiClient = vi.fn().mockResolvedValueOnce(mockReviews)
      const service = createUserService({ apiClient })

      const result = await service.getReviews('user-123')

      expect(apiClient).toHaveBeenCalledTimes(1)
      expect(apiClient).toHaveBeenCalledWith('/users/user-123/reviews')
      expect(result).toEqual(mockReviews)
    })
  })

  describe('createStripeOnboardingLink', () => {
    it('posts to the Stripe onboarding endpoint and returns the link', async () => {
      const mockLink = { url: 'https://connect.stripe.com/setup/s/abc123' }
      const apiClient = vi.fn().mockResolvedValueOnce(mockLink)
      const service = createUserService({ apiClient })

      const result = await service.createStripeOnboardingLink()

      expect(apiClient).toHaveBeenCalledTimes(1)
      expect(apiClient).toHaveBeenCalledWith('/users/me/stripe/onboarding', {
        method: 'POST'
      })
      expect(result).toEqual(mockLink)
    })
  })

  describe('getStripeStatus', () => {
    it('fetches the Stripe status of the current user', async () => {
      const mockStatus = { isStripeOnboarded: true, stripeAccountId: 'acct_123' }
      const apiClient = vi.fn().mockResolvedValueOnce(mockStatus)
      const service = createUserService({ apiClient })

      const result = await service.getStripeStatus()

      expect(apiClient).toHaveBeenCalledTimes(1)
      expect(apiClient).toHaveBeenCalledWith('/users/me/stripe/status')
      expect(result).toEqual(mockStatus)
    })
  })

  describe('auth methods', () => {
    it('register calls API correctly', async () => {
      const apiClient = vi.fn().mockResolvedValueOnce(undefined)
      const service = createUserService({ apiClient })

      await service.register('test@example.com', 'password123')

      expect(apiClient).toHaveBeenCalledWith('/auth/register', {
        method: 'POST',
        body: { email: 'test@example.com', password: 'password123' }
      })
    })

    it('login calls API correctly', async () => {
      const apiClient = vi.fn().mockResolvedValueOnce(undefined)
      const service = createUserService({ apiClient })

      await service.login('test@example.com', 'password123')

      expect(apiClient).toHaveBeenCalledWith('/auth/login?useCookies=true', {
        method: 'POST',
        body: { email: 'test@example.com', password: 'password123' },
        skipAuth: true
      })
    })

    it('logout calls API correctly', async () => {
      const apiClient = vi.fn().mockResolvedValueOnce(undefined)
      const service = createUserService({ apiClient })

      await service.logout()

      expect(apiClient).toHaveBeenCalledWith('/auth/logout', {
        method: 'POST'
      })
    })

    it('forgotPassword calls API correctly', async () => {
      const apiClient = vi.fn().mockResolvedValueOnce(undefined)
      const service = createUserService({ apiClient })

      await service.forgotPassword('test@example.com')

      expect(apiClient).toHaveBeenCalledWith('/auth/forgotPassword', {
        method: 'POST',
        body: { email: 'test@example.com' }
      })
    })

    it('resetPassword calls API correctly', async () => {
      const apiClient = vi.fn().mockResolvedValueOnce(undefined)
      const service = createUserService({ apiClient })
      const input = { email: 'test@example.com', password: 'newPassword', code: '123456' }

      await service.resetPassword(input)

      expect(apiClient).toHaveBeenCalledWith('/auth/resetPassword', {
        method: 'POST',
        body: input
      })
    })
  })

  describe('profile methods', () => {
    it('getMyProfile calls API correctly', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      const apiClient = vi.fn().mockResolvedValueOnce(mockUser)
      const service = createUserService({ apiClient })

      const result = await service.getMyProfile()

      expect(apiClient).toHaveBeenCalledWith('/users/me')
      expect(result).toEqual(mockUser)
    })

    it('updateProfile calls API correctly', async () => {
      const input = { nickname: 'NewNick' }
      const mockUser = { id: 'user-1', nickname: 'NewNick' }
      const apiClient = vi.fn().mockResolvedValueOnce(mockUser)
      const service = createUserService({ apiClient })

      const result = await service.updateProfile(input)

      expect(apiClient).toHaveBeenCalledWith('/users/me', {
        method: 'PUT',
        body: input
      })
      expect(result).toEqual(mockUser)
    })

    it('deleteAccount calls API correctly', async () => {
      const apiClient = vi.fn().mockResolvedValueOnce(undefined)
      const service = createUserService({ apiClient })

      await service.deleteAccount()

      expect(apiClient).toHaveBeenCalledWith('/users/me', {
        method: 'DELETE'
      })
    })

    it('getPublicProfile calls API correctly', async () => {
      const mockPublicUser = { id: 'user-1', nickname: 'PublicNick' }
      const apiClient = vi.fn().mockResolvedValueOnce(mockPublicUser)
      const service = createUserService({ apiClient })

      const result = await service.getPublicProfile('user-1')

      expect(apiClient).toHaveBeenCalledWith('/users/user-1')
      expect(result).toEqual(mockPublicUser)
    })

    it('getMeAdvert calls API correctly', async () => {
      const mockAdverts = [{ id: 1, title: 'My Advert' }]
      const apiClient = vi.fn().mockResolvedValueOnce(mockAdverts)
      const service = createUserService({ apiClient })

      const result = await service.getMeAdvert()

      expect(apiClient).toHaveBeenCalledWith('/users/me/adverts')
      expect(result).toEqual(mockAdverts)
    })
  })
})
