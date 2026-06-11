import type { LocationResult } from '~/types/location'
import { useApi } from '~/composables/useApi'

type ApiClient = typeof useApi

const LOCATIONS_PATH = '/locations'

/**
* Interface defining the contract of the LocationsService,
* which will be used by components to interact with location-related API endpoints.
*/
export interface LocationsService {
  searchLocations: (query: string) => Promise<LocationResult[]>
}

/**
* Interface defining the dependencies required to create an instance of LocationsService.
*/
export interface LocationsServiceDependencies {
  apiClient: ApiClient
}

/**
* Factory function to create an instance of LocationsService with the provided dependencies.
* @param param0 An object containing the dependencies required by LocationsService.
* @returns An instance of LocationsService with methods to interact with location-related API endpoints.
*/
export function createLocationsService({ apiClient }: LocationsServiceDependencies): LocationsService {
  /**
   * Search locations by postal code or city name.
   * The API only performs a search from 2 characters: shorter queries return an empty array.
   * @param query The postal code or city name fragment to search for.
   * @returns A promise that resolves to an array of LocationResult objects matching the query.
   */
  const searchLocations = async (query: string) =>
    apiClient<LocationResult[]>(`${LOCATIONS_PATH}/search`, {
      query: { query }
    })

  return {
    searchLocations
  }
}

/**
* Factory function to create an instance of LocationsService with the necessary dependencies.
* @returns An instance of LocationsService ready to be used in components.
*/
export const getLocationsService = () => {
  return createLocationsService({
    apiClient: useApi as ApiClient
  })
}
