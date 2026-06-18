export interface CheckoutRequest {
  productId: number
  productIds?: number[]
  productPrice: string
  sessions?: number
}

export interface CheckoutResponse {
  url: string
}
