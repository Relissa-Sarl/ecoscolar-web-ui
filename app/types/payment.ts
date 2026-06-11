export interface CheckoutRequest {
  productId: number
  productIds?: number[]
  productPrice: string
}

export interface CheckoutResponse {
  url: string
}
