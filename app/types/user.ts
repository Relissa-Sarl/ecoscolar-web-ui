export interface User {
  id: string
  nickname: string
  firstName: string
  lastName: string
  email: string
  postalCode: string
  birthdayDate: string
  spokenLanguages: SpokenLanguage[]
}

export interface PublicUser {
  id: string
  nickname: string
}

export interface SpokenLanguage {
  language: string
  level: string
}

export interface UpdateProfileInput {
  nickname: string
  firstName: string
  lastName: string
  postalCode: string
  birthdayDate: string
  spokenLanguages: SpokenLanguage[]
}
