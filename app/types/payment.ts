export interface CheckoutRequest {
  productId: number
  productIds?: number[]
  shippingMethod?: 'post' | 'handToHand'
  sessions?: number
}

export interface CheckoutResponse {
  url: string
}
