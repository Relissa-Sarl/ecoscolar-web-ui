import type { AdvertStatus } from '@/utils/enum/advertStatus'
import type { AdvertType } from '@/utils/enum/advertType'
import type { AdvertCondition } from '@/utils/enum/advertCondition'
import type { AdvertLanguage } from '@/utils/enum/advertLanguage'

export interface Condition {
  icon: string
  text: string
  color: string
}

export interface Seller {
  avatar: string
  username: string
  zip: string
  rating: number
  reviews: number
}

export interface Question {
  id: string
  asker: string
  avatar: string
  timestamp: string
  content: string
}

export interface Answer {
  id: string
  questionId: string
  answerer: string
  avatar: string
  timestamp: string
  content: string
  isSeller?: boolean
}

export interface Advert {
  id: string
  title: string
  authors: string
  category: string
  condition: string
  featured: boolean
  price: number
  oldPrice: number
  image: string
  images: string[]
  isbn: string
  subject: string
  grade: string
  school: string
  description: string
  conditions: Condition[]
  seller: Seller
  questions?: Question[]
  answers?: Answer[]
}

export interface MyAdvert {
  id: number
  type: AdvertType
  title: string
  price: number
  publicationDate: Date
  notificationDate: Date
  status: AdvertStatus
  userId: number
  sellerPseudo: string
  primaryImage: string
}

export interface ModifyAdvertForm {
  id: number
  title: string
  description: string
  price: number
  type: AdvertType
  status: AdvertStatus
  userId: number

  subjectId: number | null
  schoolGradeId: number | null
  teachingLanguage: AdvertLanguage | null
  studyLevel: string | null

  condition: AdvertCondition | null

  author: string | null
  publisher: string | null
  edition: string | null
  isbn: string | null
  bookCategoryId: number | null
  writtenLanguage: AdvertLanguage | null
}
