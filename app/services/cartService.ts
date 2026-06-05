import type { CartItemDto, AddToCartDto } from '../types/cart'
import { useApi } from '../composables/useApi'

type ApiClient = typeof useApi

export interface CartService {
  getCartItems: () => Promise<CartItemDto[]>
  addToCart: (dto: AddToCartDto) => Promise<CartItemDto>
  removeFromCart: (advertId: number) => Promise<void>
}

export interface CartServiceDependencies {
  apiClient: ApiClient
}

const CART_PATH = '/cart'

export function createCartService({ apiClient }: CartServiceDependencies): CartService {
  const getCartItems = async () => apiClient<CartItemDto[]>(CART_PATH)

  const addToCart = async (dto: AddToCartDto) =>
    apiClient<CartItemDto>(CART_PATH, {
      method: 'POST',
      body: dto
    })

  const removeFromCart = async (advertId: number) =>
    apiClient<undefined>(`${CART_PATH}/${advertId}`, {
      method: 'DELETE'
    })

  return {
    getCartItems,
    addToCart,
    removeFromCart
  }
}

export const getCartService = () => {
  return createCartService({
    apiClient: useApi as ApiClient
  })
}
