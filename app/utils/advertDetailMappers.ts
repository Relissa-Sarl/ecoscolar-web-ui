import type {
  Advert,
  BookReadApiItem,
  ProductReadApiItem,
  ServiceReadApiItem
} from '@/types/advert'
import type { AdvertCatalogDetailApiItem } from '@/types/catalog'
import { AdvertType } from '@/utils/enum/advertType'

function sellerFromApi(sellerPseudo: string): Advert['seller'] {
  return {
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(sellerPseudo)}`,
    username: sellerPseudo,
    zip: '',
    rating: 0,
    reviews: 0
  }
}

function resolveImages(
  pictures: string[] | undefined,
  fallbackSeed: string,
  imageUrl?: string | null
): { image: string, images: string[] } {
  if (imageUrl)
    return { image: imageUrl, images: [imageUrl] }

  const urls = pictures?.filter(Boolean) ?? []
  if (urls.length > 0)
    return { image: urls[0]!, images: urls }

  const fallback = `https://picsum.photos/seed/ecoscolar_${fallbackSeed.replace(/-/g, '').slice(0, 8)}/600/800`
  return { image: fallback, images: [fallback] }
}

function formatConditionLabel(condition: string): string {
  return condition.replace(/_/g, ' ')
}

/** GET /v1/adverts/summary/{guid} — catalogue mock ou Guid non décodable en id DB. */
export function mapCatalogSummaryToAdvert(item: AdvertCatalogDetailApiItem): Advert {
  const { image, images } = resolveImages(undefined, item.id, item.imageUrl)

  return {
    id: item.id,
    type: item.type,
    title: item.title,
    authors: '',
    category: item.category ?? '',
    condition: '',
    featured: false,
    price: item.price,
    oldPrice: item.price,
    image,
    images,
    isbn: item.isbn ?? '',
    subject: item.subject ?? '',
    grade: item.grade ?? '',
    school: '',
    description: item.description,
    conditions: [],
    seller: {
      avatar: '',
      username: '',
      zip: '',
      rating: 0,
      reviews: 0
    },
    questions: [],
    answers: []
  }
}

/** GET /v1/adverts/books/{id} */
export function mapBookToAdvert(item: BookReadApiItem, catalogGuid: string): Advert {
  const { image, images } = resolveImages(item.pictures, catalogGuid)

  return {
    id: catalogGuid,
    type: AdvertType.BOOK,
    title: item.title,
    authors: item.author,
    category: item.bookCategoryLabel,
    condition: formatConditionLabel(item.condition),
    featured: false,
    price: item.price,
    oldPrice: item.price,
    image,
    images,
    isbn: item.isbn,
    subject: '',
    grade: '',
    school: '',
    description: item.description,
    conditions: [],
    seller: sellerFromApi(item.sellerPseudo),
    questions: [],
    answers: []
  }
}

/** GET /v1/adverts/products/{id} */
export function mapProductToAdvert(item: ProductReadApiItem, catalogGuid: string): Advert {
  const { image, images } = resolveImages(item.pictures, catalogGuid)

  return {
    id: catalogGuid,
    type: AdvertType.PRODUCT,
    title: item.title,
    authors: '',
    category: item.productCategoryLabel ?? '',
    condition: formatConditionLabel(item.condition),
    featured: false,
    price: item.price,
    oldPrice: item.price,
    image,
    images,
    isbn: '',
    subject: '',
    grade: '',
    school: '',
    description: item.description,
    conditions: [],
    seller: sellerFromApi(item.sellerPseudo),
    questions: [],
    answers: []
  }
}

/** GET /v1/adverts/services/{id} — pas de condition (Swagger). */
export function mapServiceToAdvert(item: ServiceReadApiItem, catalogGuid: string): Advert {
  const { image, images } = resolveImages(undefined, catalogGuid)

  return {
    id: catalogGuid,
    type: AdvertType.SERVICE,
    title: item.title,
    authors: '',
    category: '',
    condition: '',
    featured: false,
    price: item.price,
    oldPrice: item.price,
    image,
    images,
    isbn: '',
    subject: item.subjectLabel,
    grade: item.schoolGradeLabel,
    school: item.studyLevel,
    description: item.description,
    conditions: [],
    seller: sellerFromApi(item.sellerPseudo),
    questions: [],
    answers: []
  }
}
