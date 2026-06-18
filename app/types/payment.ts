export interface CheckoutRequest {
  productId: number
  productIds?: number[]
  productPrice?: string
  shippingMethod?: 'post' | 'handToHand'
  sessions?: number
}

export interface CheckoutResponse {
  url: string
}
