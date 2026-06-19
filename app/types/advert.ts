import type { AdvertStatus } from '@/utils/enum/advertStatus'
import type { AdvertType } from '@/utils/enum/advertType'
import type { AdvertCondition } from '@/utils/enum/advertCondition'
import type { AdvertLanguage } from '@/utils/enum/advertLanguage'

export interface Condition {
  icon: string
  text: string
  color: string
}

export interface QuestionResponse {
  commentId: number
  authorId: string
  author: string
  content: string
  createdAt: string
  answer?: string | null
  answeredAt?: string | null
}

export interface Seller {
  id: string
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
  status: AdvertStatus | null
  conditions: Condition[]
  seller: Seller
  questions?: Question[]
  answers?: Answer[]
  type: AdvertType
}

export interface ServiceRead extends Advert {
  minHours: number
  maxHours: number
}

export interface MyAdvert {
  id: number
  type: AdvertType
  title: string
  price: number
  publicationDate: Date
  notificationDate: Date
  status: AdvertStatus
  userId: string
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
  userId: string

  subjectId: number | null
  schoolGradeId: number | null
  teachingLanguage: string | null
  studyLevel: string | null

  condition: AdvertCondition | null
  weight: number | null
  productCategoryId: number | null

  author: string | null
  publisher: string | null
  edition: string | null
  isbn: string | null
  bookCategoryId: number | null
  writtenLanguage: string | null

  maxHours: number | null
  minHours: number | null
}

/** GET /api/v1/adverts/books/{id} */
export interface BookReadApiItem {
  id: number
  title: string
  description: string
  price: number
  publicationDate: string
  notificationDate: string
  status: AdvertStatus | null
  userId: string
  sellerPseudo: string
  pictures: string[]
  condition: AdvertCondition
  bookCategoryId: number
  bookCategoryLabel: string
  isbn: string
  author: string
  publisher: string
  edition: string
  writtenLanguage: AdvertLanguage
  weight?: number | null
}

/** GET /api/v1/adverts/products/{id} */
export interface ProductReadApiItem {
  id: number
  title: string
  description: string
  price: number
  publicationDate: string
  notificationDate: string
  status: AdvertStatus | null
  userId: string
  sellerPseudo: string
  pictures: string[]
  condition: AdvertCondition
  weight?: number | null
  productCategoryId?: number | null
  productCategoryLabel?: string | null
}

/** GET /api/v1/adverts/services/{id} */
export interface ServiceReadApiItem {
  id: number
  title: string
  description: string
  price: number
  publicationDate: string
  notificationDate: string
  status: AdvertStatus | null
  userId: string
  sellerPseudo: string
  subjectId: number
  subjectLabel: string
  schoolGradeId: number
  schoolGradeLabel: string
  teachingLanguage: AdvertLanguage
  studyLevel: string
  minHours: number
  maxHours: number
}
