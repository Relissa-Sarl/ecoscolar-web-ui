export interface PublicUser {
  id: string
  nickname: string
}

export interface User extends PublicUser {
  firstName: string
  lastName: string
  email: string
  postalCode: string
  birthdayDate: string
  isOnboarded: boolean
  location: UserLocation
  spokenLanguages: SpokenLanguage[]
}

export interface SpokenLanguage {
  language: string
  level: string
}

export interface UserLocation {
  postalCode: string
  city: string
  region: string
}

export interface UpdateProfileInput {
  nickname: string
  firstName: string
  lastName: string
  postalCode: string
  birthdayDate: string
  spokenLanguages: SpokenLanguage[]
}
