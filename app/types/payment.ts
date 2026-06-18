export interface CheckoutRequest {
  productId: number
  productIds?: number[]
  productPrice?: string
  shippingMethod?: 'post' | 'handToHand'
}

export interface CheckoutResponse {
  url: string
}
