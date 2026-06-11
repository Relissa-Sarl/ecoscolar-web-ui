import { ref } from 'vue'
import type { BookCategory, ProductCategory, SchoolGrade, Subject } from '@/types/advertDetail'
import { getAdvertDetailsService } from '~/services/advertDetailsService'

const bookCategories = ref<BookCategory[]>([])
const productCategories = ref<ProductCategory[]>([])
const schoolGrades = ref<SchoolGrade[]>([])
const subjects = ref<Subject[]>([])
const isLoading = ref(false)
const loadError = ref(false)

let inflight: Promise<void> | null = null

export function useCatalogReferenceData() {
  async function load(): Promise<void> {
    if (bookCategories.value.length > 0 && productCategories.value.length > 0)
      return

    if (inflight)
      return inflight

    const detailsService = getAdvertDetailsService()
    isLoading.value = true
    loadError.value = false

    inflight = (async () => {
      try {
        const [books, products, grades, subs] = await Promise.all([
          detailsService.getBookCategories(),
          detailsService.getProductCategories(),
          detailsService.getSchoolGrades(),
          detailsService.getSubjects()
        ])
        bookCategories.value = books
        productCategories.value = products
        schoolGrades.value = grades
        subjects.value = subs
      } catch {
        loadError.value = true
      } finally {
        isLoading.value = false
        inflight = null
      }
    })()

    return inflight
  }

  return {
    bookCategories,
    productCategories,
    schoolGrades,
    subjects,
    isLoading,
    loadError,
    load
  }
}
