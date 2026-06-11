export default interface ApiError {
  data?: { errors?: Record<string, string[]> | string[] }
  message?: string
}
