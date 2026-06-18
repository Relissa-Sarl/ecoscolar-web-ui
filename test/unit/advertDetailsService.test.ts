import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createAdvertDetailsService } from '../../app/services/advertDetailsService'

describe('advertDetailsService', () => {
  let apiClient: ReturnType<typeof vi.fn>

  beforeEach(() => {
    apiClient = vi.fn()
    vi.clearAllMocks()
  })

  describe('getSubjects', () => {
    it('fetches subjects from /Subjects', async () => {
      const mockSubjects = [{ id: 1, name: 'Math' }, { id: 2, name: 'French' }]
      apiClient.mockResolvedValueOnce(mockSubjects)
      const service = createAdvertDetailsService({ apiClient })

      const result = await service.getSubjects()

      expect(apiClient).toHaveBeenCalledWith('/Subjects')
      expect(result).toEqual(mockSubjects)
    })

    it('propagates errors', async () => {
      apiClient.mockRejectedValueOnce(new Error('Failed'))
      const service = createAdvertDetailsService({ apiClient })

      await expect(service.getSubjects()).rejects.toThrow('Failed')
    })
  })

  describe('getSchoolGrades', () => {
    it('fetches school grades from /SchoolGrades', async () => {
      const mockGrades = [{ id: 1, name: '1st grade' }]
      apiClient.mockResolvedValueOnce(mockGrades)
      const service = createAdvertDetailsService({ apiClient })

      const result = await service.getSchoolGrades()

      expect(apiClient).toHaveBeenCalledWith('/SchoolGrades')
      expect(result).toEqual(mockGrades)
    })

    it('propagates errors', async () => {
      apiClient.mockRejectedValueOnce(new Error('Network error'))
      const service = createAdvertDetailsService({ apiClient })

      await expect(service.getSchoolGrades()).rejects.toThrow('Network error')
    })
  })

  describe('getProductCategories', () => {
    it('fetches product categories from /ProductCategories', async () => {
      const mockCategories = [{ id: 1, name: 'Textbooks' }]
      apiClient.mockResolvedValueOnce(mockCategories)
      const service = createAdvertDetailsService({ apiClient })

      const result = await service.getProductCategories()

      expect(apiClient).toHaveBeenCalledWith('/ProductCategories')
      expect(result).toEqual(mockCategories)
    })

    it('propagates errors', async () => {
      apiClient.mockRejectedValueOnce(new Error('Timeout'))
      const service = createAdvertDetailsService({ apiClient })

      await expect(service.getProductCategories()).rejects.toThrow('Timeout')
    })
  })

  describe('getLanguages', () => {
    it('fetches languages from /Languages', async () => {
      const mockLanguages = [{ id: 1, name: 'French' }, { id: 2, name: 'German' }]
      apiClient.mockResolvedValueOnce(mockLanguages)
      const service = createAdvertDetailsService({ apiClient })

      const result = await service.getLanguages()

      expect(apiClient).toHaveBeenCalledWith('/Languages')
      expect(result).toEqual(mockLanguages)
    })

    it('propagates errors', async () => {
      apiClient.mockRejectedValueOnce(new Error('Unauthorized'))
      const service = createAdvertDetailsService({ apiClient })

      await expect(service.getLanguages()).rejects.toThrow('Unauthorized')
    })
  })

  describe('getBookCategories', () => {
    it('fetches book categories from /BookCategories', async () => {
      const mockBookCategories = [{ id: 1, name: 'Novel' }, { id: 2, name: 'Textbook' }]
      apiClient.mockResolvedValueOnce(mockBookCategories)
      const service = createAdvertDetailsService({ apiClient })

      const result = await service.getBookCategories()

      expect(apiClient).toHaveBeenCalledWith('/BookCategories')
      expect(result).toEqual(mockBookCategories)
    })

    it('propagates errors', async () => {
      apiClient.mockRejectedValueOnce(new Error('Server down'))
      const service = createAdvertDetailsService({ apiClient })

      await expect(service.getBookCategories()).rejects.toThrow('Server down')
    })
  })
})
