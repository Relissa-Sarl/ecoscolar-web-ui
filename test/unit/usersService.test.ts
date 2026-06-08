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
})
