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
  languages: SpokenLanguage[]
  roles: string[]
}

export interface SpokenLanguage {
  label: string
  languageLevel: string
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
  languages: SpokenLanguage[]
}
