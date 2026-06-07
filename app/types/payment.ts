export interface CheckoutRequest {
  productId: number
  productPrice: number
}

export interface CheckoutResponse {
  url: string
}
