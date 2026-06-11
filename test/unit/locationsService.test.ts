import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { LocationResult } from '../../app/types/location'
import { createLocationsService } from '../../app/services/locationsService'

const buildLocation = (id: number): LocationResult => ({
  locationId: id,
  postalCode: '2300',
  city: `City ${id}`,
  region: 'NE'
})

describe('locationsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('searches locations through the API with the given query', async () => {
    const apiClient = vi
      .fn()
      .mockResolvedValueOnce([buildLocation(1003), buildLocation(1004)])
    const service = createLocationsService({
      apiClient
    })
    const locations = await service.searchLocations('23')
    expect(locations).toHaveLength(2)
    expect(apiClient).toHaveBeenCalledWith('/locations/search', {
      query: { query: '23' }
    })
  })

  it('returns an empty array when the API finds no location', async () => {
    const apiClient = vi
      .fn()
      .mockResolvedValueOnce([])
    const service = createLocationsService({
      apiClient
    })
    const locations = await service.searchLocations('zzzz')
    expect(locations).toEqual([])
  })
})
