export interface FlagAdminDto {
  flagId: number
  reason: string
  message: string
  reporterNickname: string
  reporterEmail: string
  createdAt?: string // Le "?" rend la propriété optionnelle si elle n'est pas toujours présente
}

export interface FlaggedUserAdminResponse {
  userId: string
  nickname: string
  email: string
  firstName: string
  lastName: string
  flags: FlagAdminDto[]
}
